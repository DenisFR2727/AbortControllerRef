import { useEffect, useRef, useState } from 'react';
import { DataUsers } from './interfaces';

const BASE_URL = 'https://jsonplaceholder.typicode.com/users';

const List: React.FC = () => {
    const [error, setError] = useState();
    const [users, setUsers] = useState<DataUsers[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [page, setPage] = useState(0);
    // Контролер для переривання запитів. Якщо сервер був недоступний а потім заробив(треба перервати минулий запит)
    const abortControllerRef = useRef<AbortController | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            abortControllerRef.current?.abort();
            abortControllerRef.current = new AbortController(); // Один контролер для одного запита

            setIsLoading(true);
            try {
                const response = await fetch(`${BASE_URL}?page=${page}`, {
                    signal: abortControllerRef.current?.signal,
                });
                const data = (await response.json()) as DataUsers[];
                setUsers(data);
            } catch (error: any) {
                if (error.name === 'AbortError') {
                    console.log('Aborted');
                    return;
                }
                setError(error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
        return () => {
            abortControllerRef.current?.abort();
        };
    }, [page]);

    if (error) {
        return <div>Something went wrong! Please try again.</div>;
    }
    return (
        <div className="list">
            <button onClick={() => setPage(page + 1)}>
                Increase Page ({page})
            </button>
            {isLoading && <div>Loading....</div>}
            {!isLoading && (
                <ul>
                    {users.map((user) => (
                        <li key={user.id}>{user.name}</li>
                    ))}
                </ul>
            )}
        </div>
    );
};
export default List;
