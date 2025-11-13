import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Stack,
  Box,
} from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import type { Store, StoreId } from "@/core/models/store/model";
import type { ISODateTime } from "@/core/models/ValueObjects";

interface EditStoreModalProps {
  open: boolean;
  store: Store | null;
  onClose: () => void;
  onSave: (store: Store) => void;
  onDelete: (storeId: StoreId) => void;
}

interface FormState {
  name: string;
}

const nowISO = () => new Date().toISOString() as ISODateTime;

const createInitialState = (store: Store | null): FormState => ({
  name: store?.name ?? "",
});

export function EditStoreModal({
  open,
  store,
  onClose,
  onSave,
  onDelete,
}: EditStoreModalProps) {
  const [formState, setFormState] = useState<FormState>(() =>
    createInitialState(store)
  );
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    setFormState(createInitialState(store));
    setErrors({});
  }, [store]);

  const isEditing = useMemo(() => Boolean(store), [store]);

  const handleChange =
    (field: keyof FormState) =>
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const value = event.target.value;
      setFormState((prev) => ({
        ...prev,
        [field]: value,
      }));
    };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formState.name.trim()) {
      newErrors.name = "Store name is required";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;

    if (store) {
      // Editing existing store - send full store with updated name
      const timestamp = nowISO();
      onSave({
        ...store,
        name: formState.name.trim(),
        updatedAt: timestamp,
      });
    } else {
      // Creating new store - only send name to parent
      // Parent will call API with just name, server will generate id, createdAt, updatedAt
      // The actual store with full fields will be returned from the API
      const tempStore: Store = {
        id: `temp-${Date.now()}` as string as StoreId,
        name: formState.name.trim(),
        createdAt: nowISO(),
        updatedAt: nowISO(),
      };
      onSave(tempStore);
    }
  };

  const handleDelete = () => {
    if (!store) return;
    onDelete(store.id);
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth='sm'
      fullWidth
      aria-labelledby='edit-store-dialog-title'
    >
      <DialogTitle id='edit-store-dialog-title'>
        {isEditing ? "Edit Store" : "Create Store"}
      </DialogTitle>
      <DialogContent dividers>
        <Stack spacing={2}>
          <TextField
            label='Store Name'
            value={formState.name}
            onChange={handleChange("name")}
            error={Boolean(errors.name)}
            helperText={errors.name}
            fullWidth
          />
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
        {isEditing && (
          <Button color='error' variant='outlined' onClick={handleDelete}>
            Delete Store
          </Button>
        )}
        {!isEditing && <Box />}
        <DialogActions sx={{ p: 0 }}>
          <Button onClick={onClose}>Cancel</Button>
          <Button onClick={handleSubmit} variant='contained'>
            {isEditing ? "Save Changes" : "Create"}
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
}
