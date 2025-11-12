import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Stack,
  Typography,
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
    const timestamp = nowISO();

    if (store) {
      onSave({
        ...store,
        name: formState.name.trim(),
        updatedAt: timestamp,
      });
    } else {
      const newStore: Store = {
        id: `store-${Date.now()}` as string as StoreId,
        name: formState.name.trim(),
        createdAt: timestamp,
        updatedAt: timestamp,
      };
      onSave(newStore);
    }
  };

  const handleDelete = () => {
    if (!store) return;
    onDelete(store.id);
  };

  const createdDisplay = store
    ? new Date(store.createdAt).toLocaleString(undefined, {
        dateStyle: "medium",
        timeStyle: "short",
      })
    : "Will be generated";

  const updatedDisplay = store
    ? new Date(store.updatedAt).toLocaleString(undefined, {
        dateStyle: "medium",
        timeStyle: "short",
      })
    : "Will be generated";

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
          <Box>
            <Typography variant='caption' color='text.secondary'>
              Created
            </Typography>
            <Typography variant='body2'>{createdDisplay}</Typography>
          </Box>
          <Box>
            <Typography variant='caption' color='text.secondary'>
              Last Updated
            </Typography>
            <Typography variant='body2'>{updatedDisplay}</Typography>
          </Box>
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
          disabled={!store}
        >
          Delete Store
        </Button>
        <DialogActions sx={{ p: 0 }}>
          <Button onClick={onClose}>Cancel</Button>
          <Button onClick={handleSubmit} variant='contained'>
            {isEditing ? "Save Changes" : "Create Store"}
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
}
