const SERVER_PATH = "http://localhost:5000/admin"
export async function read(path: string) {
  try {
    return fetch(SERVER_PATH + path, {
      method: "GET",
      headers: {
        auth_pass: localStorage.getItem("backman_pass") as any,
        "Content-Type": "application/json",
      },
    }).then((s) => s.json())
  } catch (error) {
    console.log("test", error);
    return true;
  }
}
export async function update(path: string, change: any) {
  console.log("test")
  try {
    const attempt = await fetch(SERVER_PATH + path, {
      method: "PATCH",
      headers: {
        auth_pass: localStorage.getItem("backman_pass") as any,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(change),
    });
    if ((attempt.body as any).err) return true;
    return !attempt.ok;
  } catch (error) {
    console.log("test", error)
    return true;
  }
}