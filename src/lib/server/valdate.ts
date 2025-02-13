import z from "zod";

export async function extract(request: Request) {
  const formData = await request.formData();
  const data: Record<string, unknown> = Object.fromEntries(formData.entries());

  // Get all array keys
  const uniqueArrayKeys = new Set(
    Array.from(formData.keys()).filter((key) => key.endsWith("[]")),
  );
  for (const key of uniqueArrayKeys) {
    const values = formData.getAll(key);
    const arrayKeyName = key.replace(/\[\]$/, "");
    data[arrayKeyName] ??= [];
    if (Array.isArray(data[arrayKeyName])) {
      data[arrayKeyName].push(...values);
    }
  }

  // If id is present convert it to a number
  if (data.id) {
    data.id = parseInt(data.id.toString(), 10);
  }

  // Convert empty strings to undefined
  for (const key in data) {
    if (data[key] === "") {
      data[key] = undefined;
    }
  }

  return data;
}

export async function validate(
  modelValidator: z.Schema,
  extracted: Record<string, unknown>,
) {
  const parsed = modelValidator.safeParse(extracted);

  const result = {
    ...parsed,
    errors: parsed.error?.format(),
  };

  return result;
}

export async function extractAndValidate(
  modelValidator: z.Schema,
  request: Request,
) {
  const extracted = await extract(request);
  const validated = await validate(modelValidator, extracted);
  return validated;
}
