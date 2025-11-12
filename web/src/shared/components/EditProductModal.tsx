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

interface EditProductModalProps {
  open: boolean;
  product: ProductWithStoreName | null;
  storeOptions: Array<{ id: string; name: string }>;
  categoryOptions: string[];
  onClose: () => void;
  onSave: (product: ProductWithStoreName) => void;
  onDelete: (productId: string) => void;
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
    const defaultStore = storeOptions[0];
    return {
      name: "",
      storeId: defaultStore?.id ?? "",
      storeName: defaultStore?.name ?? "",
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

  useEffect(() => {
    setFormState(createInitialState(product, storeOptions));
    setErrors({});
  }, [product, storeOptions]);

  const isEditing = useMemo(() => Boolean(product), [product]);
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

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formState.name.trim()) {
      newErrors.name = "Product name is required";
    }

    if (!formState.category.trim()) {
      newErrors.category = "Category is required";
    }

    const stockValue = Number(formState.stockQuantity);
    if (Number.isNaN(stockValue) || stockValue < 0) {
      newErrors.stockQuantity = "Stock quantity must be a positive number";
    }

    const priceValue = Number(formState.price);
    if (Number.isNaN(priceValue) || priceValue < 0) {
      newErrors.price = "Price must be a positive number";
    }

    if (!formState.storeId) {
      newErrors.storeId = "Store is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (!product) return;
    if (!validate()) return;

    const updatedProduct: ProductWithStoreName = {
      ...product,
      name: formState.name.trim(),
      storeId: formState.storeId as ProductWithStoreName["storeId"],
      storeName: formState.storeName,
      category: formState.category,
      stockQuantity: Number(formState.stockQuantity),
      price: Number(formState.price) as Price,
    };

    onSave(updatedProduct);
  };

  const handleDelete = () => {
    if (!product) return;
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
            helperText={errors.storeId}
            fullWidth
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
        <Button
          color='error'
          variant='outlined'
          onClick={handleDelete}
          disabled={!product}
        >
          Delete Product
        </Button>
        <DialogActions sx={{ p: 0 }}>
          <Button onClick={onClose}>Cancel</Button>
          <Button onClick={handleSave} variant='contained' disabled={!product}>
            Save Changes
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
}
