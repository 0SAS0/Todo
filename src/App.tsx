import { SyntheticEvent, useRef, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { List } from './list.type.ts';
import { toast, Toaster } from 'sonner';

const App = () => {
  const [value, setValue] = useState<string>('');
  const [list, setList] = useState<List[]>([]);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const handleInput = (value: string) => {
    setValue(value);
  };

  const handleSubmit = (event: SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (value.trim() === '') {
      toast.error('Minimum 1 characters long');
      return;
    }
    setList((prevState) => [
      ...prevState,
      {
        uuid: uuidv4(),
        value: value,
        isDone: false,
      },
    ]);
    setValue('');
    inputRef.current?.focus();
  };
  const handleCheck = (uuid: string) => {
    setList((prevState) =>
      prevState.map((item) => {
        if (uuid === item.uuid) {
          return { ...item, isDone: !item.isDone };
        }
        return item;
      }),
    );
  };
  const handleDelete = (uuid: string) => {
    setList((prevState) => prevState.filter((item) => item.uuid !== uuid));
  };
  return (
    <div className={'bg-zinc-100 min-h-screen flex items-start justify-center py-8'}>
      <div
        className={
          'w-5xl bg-zinc-200 rounded-lg p-4 flex items-center justify-center flex-wrap gap-2 flex-col'
        }
      >
        <h1 className={'text-center text-5xl font-bold text-zinc-700'}>TODO LIST</h1>
        <form className={'flex flex-wrap gap-2 w-full'} onSubmit={handleSubmit}>
          <input
            placeholder={'Task...'}
            className={
              'bg-zinc-100 rounded outline-none focus:ring-2 focus:ring-zinc-700 py-1.5 px-2.5 flex-1'
            }
            value={value}
            ref={inputRef}
            onChange={(e) => handleInput(e.target.value)}
          />
          <button
            className={'rounded bg-blue-500 py-1.5 px-6 text-white font-bold hover:bg-blue-600'}
          >
            Add
          </button>
        </form>
        <ul>
          {list.map((item) => (
            <li key={item.uuid}>
              {item.value}
              <input
                className={'size-6 '}
                checked={item.isDone}
                type={'checkbox'}
                onChange={() => handleCheck(item.uuid)}
              />
              <button
                className={'rounded bg-red-500 py-1.5 px-6 text-white font-bold hover:bg-red-700'}
                onClick={() => handleDelete(item.uuid)}
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      </div>

      <Toaster richColors position="top-center" />
    </div>
  );
};
export default App;
