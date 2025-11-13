import type { TableConfig, TableSchema, ParsedSchema } from "../types";

export function validateSchema(schema: TableSchema): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (!schema || typeof schema !== "object") {
    errors.push("Schema must be an object");
    return { valid: false, errors };
  }

  for (const [source, fields] of Object.entries(schema)) {
    if (!fields || typeof fields !== "object") {
      errors.push(`Source "${source}" must be an object`);
      continue;
    }

    for (const [field, config] of Object.entries(fields)) {
      if (!config || typeof config !== "object") {
        errors.push(`Field "${source}.${field}" must be an object`);
        continue;
      }

      if (!Array.isArray(config.value_types)) {
        errors.push(`Field "${source}.${field}" must have value_types array`);
      }

      if (!Array.isArray(config.values)) {
        errors.push(`Field "${source}.${field}" must have values array`);
      }
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

export function validateConfig(config: Partial<TableConfig>): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (!config.schema) {
    errors.push("Schema is required");
  } else {
    const schemaValidation = validateSchema(config.schema);
    if (!schemaValidation.valid) {
      errors.push(...schemaValidation.errors);
    }
  }

  if (!config.getData) {
    errors.push("getData service function is required");
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

export function validateParsedSchema(schema: ParsedSchema): boolean {
  if (!schema.fields || schema.fields.length === 0) {
    return false;
  }

  if (!schema.fieldMap || schema.fieldMap.size === 0) {
    return false;
  }

  return true;
}
