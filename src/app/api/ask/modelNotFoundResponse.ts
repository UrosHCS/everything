export function modelNotFoundResponse(model: string, id: string | number) {
  return new Response(`${model} "${id}" not found`, { status: 404 });
}
