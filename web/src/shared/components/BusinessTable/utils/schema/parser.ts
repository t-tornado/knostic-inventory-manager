import type { TableSchema, ParsedSchema, ParsedField } from "../../types";

export function parseSchema(schema: TableSchema): ParsedSchema {
  const fields: ParsedField[] = [];
  const sources = new Set<string>();
  const fieldMap = new Map<string, ParsedField>();

  for (const [source, sourceFields] of Object.entries(schema)) {
    sources.add(source);

    for (const [field, config] of Object.entries(sourceFields)) {
      const fullKey = `${source}.${field}`;

      const parsedField: ParsedField = {
        source,
        field,
        valueTypes: config.value_types || [],
        values: config.values || [],
        types: config.types,
        fullKey,
      };

      fields.push(parsedField);
      fieldMap.set(fullKey, parsedField);
    }
  }

  return {
    fields,
    sources: Array.from(sources),
    fieldMap,
  };
}

export function getFieldByKey(
  schema: ParsedSchema,
  key: string
): ParsedField | undefined {
  return schema.fieldMap.get(key);
}

export function getFieldsBySource(
  schema: ParsedSchema,
  source: string
): ParsedField[] {
  return schema.fields.filter((f) => f.source === source);
}

export function getFilterableFields(schema: ParsedSchema): ParsedField[] {
  return schema.fields.filter((field) => field.valueTypes.length > 0);
}

export function getGroupableFields(schema: ParsedSchema): ParsedField[] {
  return schema.fields.filter(
    (field) => field.values.length > 0 && field.values.length <= 50 // Reasonable limit for grouping
  );
}

export function getSortableFields(schema: ParsedSchema): ParsedField[] {
  return schema.fields;
}
