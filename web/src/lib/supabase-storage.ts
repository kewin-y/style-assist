const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_KEY
const BUCKET_NAME = "clothes"

function ensureSupabaseConfig() {
  if (!SUPABASE_URL || !SUPABASE_KEY) {
    throw new Error("Supabase storage is not configured.")
  }
}

function getFileExtension(file: File) {
  const extension = file.name.split(".").pop()?.trim().toLowerCase()
  return extension || "png"
}

function encodeObjectPath(objectPath: string) {
  return objectPath
    .split("/")
    .map((segment) => encodeURIComponent(segment))
    .join("/")
}

export async function uploadInspoImage(file: File, userId: string) {
  ensureSupabaseConfig()

  const objectPath = `${userId}/inspo/${crypto.randomUUID()}.${getFileExtension(file)}`
  const encodedPath = encodeObjectPath(objectPath)
  const uploadUrl = `${SUPABASE_URL}/storage/v1/object/${BUCKET_NAME}/${encodedPath}`

  const response = await fetch(uploadUrl, {
    method: "POST",
    headers: {
      apikey: SUPABASE_KEY,
      Authorization: `Bearer ${SUPABASE_KEY}`,
      "Content-Type": file.type || "application/octet-stream",
      "x-upsert": "false",
    },
    body: file,
  })

  if (!response.ok) {
    const message = await response.text()
    throw new Error(message || "Failed to upload inspiration image.")
  }

  return `${SUPABASE_URL}/storage/v1/object/public/${BUCKET_NAME}/${encodedPath}`
}
