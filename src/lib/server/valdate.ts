import z from "zod";

export default async function validate(modelValidator: z.Schema, request: Request) {
  const formData = await request.formData();
  const data: Record<string, unknown> = Object.fromEntries(formData.entries());

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

  const parsed = modelValidator.safeParse(data);

  const result = {
    ...parsed,
    errors: parsed.error?.format(),
  };

  return result;
}
