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
import type { ProductWithStoreName } from "@/features/product/types";
import {
  productPayloadSchema,
  type ProductPayload,
} from "@/features/product/validation";
import { formatDateTime } from "@/shared/utils/format";
import { createInitialState } from "./createInitialState";
import { ProductMetaModalFormState } from "./types";

export type ProductMetaModalMode = "create" | "edit";

interface ProductMetaModalProps {
  open: boolean;
  mode: ProductMetaModalMode;
  product: ProductWithStoreName | null;
  storeOptions: Array<{ id: string; name: string }>;
  categoryOptions: string[];
  onClose: () => void;
  onCreate?: (data: ProductPayload) => void;
  onUpdate?: (product: ProductWithStoreName) => void;
  onDelete?: (productId: string) => void;
}

export function ProductMetaModal({
  open,
  mode,
  product,
  storeOptions,
  categoryOptions,
  onClose,
  onCreate,
  onUpdate,
  onDelete,
}: ProductMetaModalProps) {
  const [formState, setFormState] = useState<ProductMetaModalFormState>(() =>
    createInitialState(product, storeOptions)
  );
  const [errors, setErrors] = useState<Record<string, string>>({});

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
    (field: keyof ProductMetaModalFormState) =>
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const value = event.target.value;
      setFormState((prev) => ({
        ...prev,
        [field]: value,
      }));
    };

  const handleStoreChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedStoreId = String(event.target.value);
    const selectedStore =
      storeOptions.find((store) => store.id === selectedStoreId) ?? null;
    setFormState((prev) => ({
      ...prev,
      storeId: selectedStoreId,
      storeName: selectedStore?.name ?? prev.storeName,
    }));
  };

  const validate = (): boolean => {
    const payload: ProductPayload = {
      name: formState.name.trim(),
      storeId: formState.storeId,
      category: formState.category.trim(),
      stockQuantity: Number(formState.stockQuantity),
      price: Number(formState.price),
    };

    const result = productPayloadSchema.safeParse(payload);

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

  const handleCreate = () => {
    if (!validate() || !onCreate) return;

    const payload: ProductPayload = {
      name: formState.name.trim(),
      storeId: formState.storeId,
      category: formState.category.trim(),
      stockQuantity: Number(formState.stockQuantity),
      price: Number(formState.price),
    };

    onCreate(payload);
  };

  const handleUpdate = () => {
    if (!validate() || !product || !onUpdate) return;

    const updatedProduct: ProductWithStoreName = {
      ...product,
      name: formState.name.trim(),
      storeId: formState.storeId as ProductWithStoreName["storeId"],
      storeName: formState.storeName,
      category: formState.category.trim(),
      stockQuantity: Number(formState.stockQuantity),
      price: Number(formState.price) as ProductWithStoreName["price"],
    };

    onUpdate(updatedProduct);
  };

  const handleSave = () => {
    if (mode === "create") {
      handleCreate();
    } else {
      handleUpdate();
    }
  };

  const handleDelete = () => {
    if (!product || !onDelete) return;
    onDelete(product.id);
  };

  const title = mode === "create" ? "Create Product" : "Edit Product";
  const saveButtonText = mode === "create" ? "Create Product" : "Save Changes";

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth='sm'
      fullWidth
      aria-labelledby='product-meta-dialog-title'
    >
      <DialogTitle id='product-meta-dialog-title'>{title}</DialogTitle>
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
              Last updated: {formatDateTime(product.updatedAt)}
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
        {mode === "edit" && onDelete && (
          <Button color='error' variant='outlined' onClick={handleDelete}>
            Delete Product
          </Button>
        )}
        {mode === "create" && <Box />}
        <DialogActions sx={{ p: 0 }}>
          <Button onClick={onClose}>Cancel</Button>
          <Button onClick={handleSave} variant='contained'>
            {saveButtonText}
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
}
