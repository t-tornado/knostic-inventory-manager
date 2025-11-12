import { useState } from "react";
import {
  Popover,
  Box,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Button,
  Stack,
} from "@mui/material";
import type { SelectChangeEvent } from "@mui/material";
import { useFilters } from "../hooks/useFilters";
import { useTableState } from "../hooks";
import {
  getOperatorsForField,
  getOperatorLabel,
  isDateField,
  isEnumField,
  isNumberField,
} from "../utils/filters/operators";
import type { FilterOperator, Filter } from "../types";
import { filterActions } from "../state/actions";

interface FilterPopoverProps {
  anchorEl: HTMLElement | null;
  onClose: () => void;
}

export function FilterPopover({ anchorEl, onClose }: FilterPopoverProps) {
  const { schema, dispatch } = useTableState();
  const { filterableFields } = useFilters();

  const [selectedField, setSelectedField] = useState<string>("");
  const [selectedOperator, setSelectedOperator] = useState<FilterOperator | "">(
    ""
  );
  const [value, setValue] = useState<
    string | number | (string | number)[] | null
  >("");

  const open = Boolean(anchorEl);

  // Get selected field details
  const field = selectedField ? schema.fieldMap.get(selectedField) : undefined;

  // Get available operators for selected field
  const availableOperators = field
    ? getOperatorsForField(field.valueTypes)
    : [];

  // Get field values if it's an enum/select field
  const fieldValues =
    field && isEnumField(field.valueTypes) ? field.values : [];

  // Check if field is date type
  const isDate = field ? isDateField(field.valueTypes) : false;

  // Check if operator requires no value (is_null, is_not_null)
  const requiresNoValue =
    selectedOperator === "is_null" || selectedOperator === "is_not_null";

  // Check if operator requires array value (in, not_in)
  const requiresArrayValue =
    selectedOperator === "in" || selectedOperator === "not_in";

  const handleFieldChange = (event: SelectChangeEvent<string>) => {
    const newField = event.target.value;
    setSelectedField(newField);
    setSelectedOperator(""); // Reset operator when field changes
    setValue(""); // Reset value when field changes
  };

  const handleOperatorChange = (event: SelectChangeEvent<string>) => {
    const newOperator = event.target.value as FilterOperator;
    setSelectedOperator(newOperator);

    // Reset value based on operator type
    if (newOperator === "is_null" || newOperator === "is_not_null") {
      setValue(null);
    } else if (newOperator === "in" || newOperator === "not_in") {
      setValue([]);
    } else {
      setValue("");
    }
  };

  const handleAddFilter = () => {
    if (!selectedField || !selectedOperator) return;

    // Validate value for operators that require it
    if (
      !requiresNoValue &&
      (value === "" ||
        value === null ||
        (Array.isArray(value) && value.length === 0))
    ) {
      return;
    }

    // Handle array values for "in" and "not_in" operators
    let filterValue: string | number | (string | number)[] | null = value;
    if (requiresArrayValue && typeof value === "string") {
      // Split comma-separated values
      filterValue = value.split(",").map((v) => {
        const trimmed = v.trim();
        if (field && isNumberField(field.valueTypes)) {
          const num = Number(trimmed);
          return isNaN(num) ? trimmed : num;
        }
        return trimmed;
      });
    }

    const newFilter: Omit<Filter, "id"> = {
      field: selectedField,
      operator: selectedOperator as FilterOperator,
      value: requiresNoValue ? null : filterValue,
      source: field?.source,
    };

    dispatch(
      filterActions.add({
        ...newFilter,
        id: `filter-${Date.now()}-${Math.random()}`,
      })
    );

    // Reset form
    setSelectedField("");
    setSelectedOperator("");
    setValue("");
    onClose();
  };

  const handleCancel = () => {
    setSelectedField("");
    setSelectedOperator("");
    setValue("");
    onClose();
  };

  return (
    <Popover
      open={open}
      anchorEl={anchorEl}
      onClose={handleCancel}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "left",
      }}
      transformOrigin={{
        vertical: "top",
        horizontal: "left",
      }}
    >
      <Box sx={{ p: 3, minWidth: 400 }}>
        <Stack spacing={2}>
          <FormControl fullWidth size='small'>
            <InputLabel>Field</InputLabel>
            <Select
              value={selectedField}
              label='Field'
              onChange={handleFieldChange}
            >
              {filterableFields.map((field) => (
                <MenuItem key={field.fullKey} value={field.fullKey}>
                  {field.field} {field.source ? `(${field.source})` : ""}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {selectedField && (
            <FormControl fullWidth size='small'>
              <InputLabel>Operator</InputLabel>
              <Select
                value={selectedOperator}
                label='Operator'
                onChange={handleOperatorChange}
              >
                {availableOperators.map((operator) => (
                  <MenuItem key={operator} value={operator}>
                    {getOperatorLabel(operator)}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}

          {selectedOperator && !requiresNoValue && (
            <>
              {isDate ? (
                <TextField
                  size='small'
                  label='Value'
                  type='date'
                  value={value || ""}
                  onChange={(e) => setValue(e.target.value)}
                  fullWidth
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              ) : isEnumField(field?.valueTypes || []) ? (
                <FormControl fullWidth size='small'>
                  <InputLabel>Value</InputLabel>
                  <Select
                    value={
                      requiresArrayValue
                        ? Array.isArray(value)
                          ? value
                          : []
                        : String(value || "")
                    }
                    label='Value'
                    onChange={(e) => {
                      if (requiresArrayValue) {
                        setValue(
                          typeof e.target.value === "string"
                            ? [e.target.value]
                            : e.target.value
                        );
                      } else {
                        setValue(e.target.value);
                      }
                    }}
                    multiple={requiresArrayValue}
                  >
                    {fieldValues.map((val) => (
                      <MenuItem key={String(val)} value={String(val)}>
                        {String(val)}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              ) : (
                <TextField
                  size='small'
                  label='Value'
                  value={
                    requiresArrayValue
                      ? Array.isArray(value)
                        ? value.join(", ")
                        : typeof value === "string"
                        ? value
                        : ""
                      : String(value || "")
                  }
                  onChange={(e) => {
                    const newValue = e.target.value;
                    if (requiresArrayValue) {
                      // For array operators, store as string and parse on submit
                      setValue(newValue);
                    } else if (field && isNumberField(field.valueTypes)) {
                      // Try to parse as number if field is number type
                      const numValue = Number(newValue);
                      setValue(isNaN(numValue) ? newValue : numValue);
                    } else {
                      setValue(newValue);
                    }
                  }}
                  type={
                    isNumberField(field?.valueTypes || []) ? "number" : "text"
                  }
                  fullWidth
                  placeholder={
                    requiresArrayValue
                      ? "Enter values separated by commas"
                      : "Enter value"
                  }
                />
              )}
            </>
          )}

          <Stack direction='row' spacing={1} justifyContent='flex-end'>
            <Button size='small' onClick={handleCancel}>
              Cancel
            </Button>
            <Button
              size='small'
              variant='contained'
              onClick={handleAddFilter}
              disabled={
                !selectedField ||
                !selectedOperator ||
                (!requiresNoValue && (value === "" || value === null))
              }
            >
              Add Filter
            </Button>
          </Stack>
        </Stack>
      </Box>
    </Popover>
  );
}
