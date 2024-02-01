async function fetchUsers(signal: any) {
    try {
        const url = `https://jsonplaceholder.typicode.com/users`;
        const response = await fetch(url, { signal });

        if (response.ok) {
            return await response.json();
        } else {
            throw new Error(`Request failed with status ${response.status}`);
        }
    } catch (error) {
        console.error(error);
    }
}
export default fetchUsers;
