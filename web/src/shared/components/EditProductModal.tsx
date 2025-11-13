import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Stack,
  MenuItem,
  Typography,
  Box,
} from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import type { Price } from "@/core/models/ValueObjects";
import type { ProductWithStoreName } from "@/features/product/types";
import {
  editProductSchema,
  type EditProductPayload,
} from "./EditProductModal/validation";

interface EditProductModalProps {
  open: boolean;
  product: ProductWithStoreName | null;
  storeOptions: Array<{ id: string; name: string }>;
  categoryOptions: string[];
  onClose: () => void;
  onSave: (product: ProductWithStoreName) => void;
  onDelete?: (productId: string) => void;
}

interface FormState {
  name: string;
  storeId: string;
  storeName: string;
  category: string;
  stockQuantity: string;
  price: string;
}

const createInitialState = (
  product: ProductWithStoreName | null,
  storeOptions: Array<{ id: string; name: string }>
): FormState => {
  if (!product) {
    return {
      name: "",
      storeId: storeOptions[0]?.id ?? "",
      storeName: storeOptions[0]?.name ?? "",
      category: "",
      stockQuantity: "",
      price: "",
    };
  }

  const foundStore =
    storeOptions.find((option) => option.id === product.storeId) ||
    storeOptions.find((option) => option.name === product.storeName);

  return {
    name: product.name,
    storeId: foundStore?.id ?? (product.storeId as string),
    storeName: foundStore?.name ?? product.storeName ?? "",
    category: product.category ?? "",
    stockQuantity: String(product.stockQuantity ?? ""),
    price: String(product.price ?? ""),
  };
};

export function EditProductModal({
  open,
  product,
  storeOptions,
  categoryOptions,
  onClose,
  onSave,
  onDelete,
}: EditProductModalProps) {
  const [formState, setFormState] = useState<FormState>(() =>
    createInitialState(product, storeOptions)
  );
  const [errors, setErrors] = useState<Record<string, string>>({});

  const isEditing = useMemo(() => Boolean(product), [product]);

  useEffect(() => {
    setFormState(createInitialState(product, storeOptions));
    setErrors({});
  }, [product, storeOptions]);

  const categories = useMemo(() => {
    if (!product?.category || categoryOptions.includes(product.category)) {
      return categoryOptions;
    }
    return [...categoryOptions, product.category];
  }, [categoryOptions, product?.category]);

  const handleChange =
    (field: keyof FormState) =>
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const value = event.target.value;
      setFormState((prev) => ({
        ...prev,
        [field]: value,
      }));
    };

  const handleStoreChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedStoreId = event.target.value;
    const selectedStore =
      storeOptions.find((store) => store.id === selectedStoreId) ?? null;
    setFormState((prev) => ({
      ...prev,
      storeId: selectedStoreId,
      storeName: selectedStore?.name ?? prev.storeName,
    }));
  };

  const validate = (): boolean => {
    const payload: EditProductPayload = {
      name: formState.name.trim(),
      storeId: formState.storeId,
      category: formState.category.trim(),
      stockQuantity: Number(formState.stockQuantity),
      price: Number(formState.price),
    };

    const result = editProductSchema.safeParse(payload);

    if (!result.success) {
      const newErrors: Record<string, string> = {};
      result.error.issues.forEach((issue) => {
        const field = issue.path[0] as string;
        if (field) {
          newErrors[field] = issue.message;
        }
      });
      setErrors(newErrors);
      return false;
    }

    setErrors({});
    return true;
  };

  const handleSave = () => {
    if (!validate()) return;

    const payload: EditProductPayload = {
      name: formState.name.trim(),
      storeId: formState.storeId,
      category: formState.category.trim(),
      stockQuantity: Number(formState.stockQuantity),
      price: Number(formState.price),
    };

    if (product) {
      // Editing existing product
      const updatedProduct: ProductWithStoreName = {
        ...product,
        name: payload.name,
        storeId: payload.storeId as ProductWithStoreName["storeId"],
        storeName: formState.storeName,
        category: payload.category,
        stockQuantity: payload.stockQuantity,
        price: payload.price as Price,
      };
      onSave(updatedProduct);
    } else {
      // Creating new product - onSave will handle the creation
      const newProduct: ProductWithStoreName = {
        id: `temp-${Date.now()}` as ProductWithStoreName["id"],
        name: payload.name,
        storeId: payload.storeId as ProductWithStoreName["storeId"],
        storeName: formState.storeName,
        category: payload.category,
        stockQuantity: payload.stockQuantity,
        price: payload.price as Price,
        createdAt:
          new Date().toISOString() as ProductWithStoreName["createdAt"],
        updatedAt:
          new Date().toISOString() as ProductWithStoreName["updatedAt"],
      };
      onSave(newProduct);
    }
  };

  const handleDelete = () => {
    if (!product || !onDelete) return;
    onDelete(product.id);
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth='sm'
      fullWidth
      aria-labelledby='edit-product-dialog-title'
    >
      <DialogTitle id='edit-product-dialog-title'>
        {isEditing ? "Edit Product" : "Create Product"}
      </DialogTitle>
      <DialogContent dividers>
        <Stack spacing={2}>
          <TextField
            label='Product Name'
            value={formState.name}
            onChange={handleChange("name")}
            error={Boolean(errors.name)}
            helperText={errors.name}
            fullWidth
          />
          <TextField
            select
            label='Store'
            value={formState.storeId}
            onChange={handleStoreChange}
            error={Boolean(errors.storeId)}
            helperText={
              errors.storeId ||
              (storeOptions.length === 0
                ? "No stores available. Please create a store first."
                : "")
            }
            fullWidth
            disabled={storeOptions.length === 0}
          >
            {storeOptions.map((store) => (
              <MenuItem key={store.id} value={store.id}>
                {store.name}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            select
            label='Category'
            value={formState.category}
            onChange={handleChange("category")}
            error={Boolean(errors.category)}
            helperText={errors.category}
            fullWidth
          >
            {categories.map((category) => (
              <MenuItem key={category} value={category}>
                {category}
              </MenuItem>
            ))}
          </TextField>
          <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
            <TextField
              label='Stock Quantity'
              value={formState.stockQuantity}
              onChange={handleChange("stockQuantity")}
              error={Boolean(errors.stockQuantity)}
              helperText={errors.stockQuantity}
              type='number'
              fullWidth
              inputProps={{ min: 0 }}
            />
            <TextField
              label='Price'
              value={formState.price}
              onChange={handleChange("price")}
              error={Boolean(errors.price)}
              helperText={errors.price}
              type='number'
              fullWidth
              inputProps={{ min: 0, step: 0.01 }}
            />
          </Stack>
          {product && (
            <Typography variant='body2' color='text.secondary'>
              Last updated:{" "}
              {new Date(product.updatedAt).toLocaleString(undefined, {
                dateStyle: "medium",
                timeStyle: "short",
              })}
            </Typography>
          )}
        </Stack>
      </DialogContent>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          px: 3,
          py: 2,
        }}
      >
        {isEditing && onDelete && (
          <Button color='error' variant='outlined' onClick={handleDelete}>
            Delete Product
          </Button>
        )}
        {!isEditing && <Box />}
        <DialogActions sx={{ p: 0 }}>
          <Button onClick={onClose}>Cancel</Button>
          <Button onClick={handleSave} variant='contained'>
            {isEditing ? "Save Changes" : "Create Product"}
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
}
