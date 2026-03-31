export async function get(token: string, url: string) {
    const response = await fetch(`${import.meta.env.PUBLIC_API_URL}/${url}`, {
        headers: {
            Authorization: token as string,
        }
    });

    if (response.status !== 200) {
        console.warn("Failed to fetch user");
        return null;
    }

    return await response.json();
}

export async function getUser(token: string) {
    return await get(token, 'self');
}

export async function getPlayers(token: string) {
    return await get(token, 'player');
}