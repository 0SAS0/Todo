import { SyntheticEvent, useRef, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { List } from './list.type.ts';
import { toast, Toaster } from 'sonner';
import { twMerge } from 'tailwind-merge';
import { useLocalStorage } from './use-local-storage.ts';

const App = () => {
  const [value, setValue] = useState<string>('');
  const [list, setList] = useLocalStorage<List[]>('list', []);
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
        isEdit: false,
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
  const toggleEdit = (uuid: string) => {
    setList((prevState) =>
    prevState.map((item) => {
      if (item.uuid === uuid){
        return {...item, isEdit: true};
      }
      return item;
    }))
  }
  const saveEdit = (uuid: string, newValue: string) => {
    setList((prevState) =>
      prevState.map((item) => {
        if (item.uuid === uuid) {
          return {...item, isEdit: false, value: newValue};
        }
        return item;
      })
    )
  }
  return (
    <div className={'bg-zinc-100 min-h-screen flex items-start justify-center py-8'}>
      <div className={'w-5xl bg-zinc-200 rounded-lg p-4 flex  flex-wrap gap-2 flex-col'}>
        <h1 className={'text-center text-5xl font-bold text-zinc-700'}>TODO LIST</h1>
        <form className={'flex flex-wrap gap-2 w-full'} onSubmit={handleSubmit}>
          <input
            placeholder={'Task...'}
            className={
              'bg-zinc-100 rounded-md outline-none focus:ring-2 focus:ring-zinc-700 py-1.5 px-2.5 flex-1'
            }
            value={value}
            ref={inputRef}
            onChange={(e) => handleInput(e.target.value)}
          />
          <button
            className={'rounded-md bg-blue-500 py-1.5 px-6 text-white font-bold hover:bg-blue-600'}
          >
            Add
          </button>
        </form>
        <ul className={'w-full gap-2 grid'}>
          {list.map((item) => (
            <li
              className={
                'gap-1.5 grid grid-cols-[auto_1fr_auto] items-center bg-zinc-100 px-2 py-3 rounded-md'
              }
              key={item.uuid}
            >
              {item.isEdit ? (
                <><input
                  className={'bg-zinc-100 rounded-md outline-none focus:ring-2 focus:ring-zinc-700 py-1.5 px-2.5 flex-1'}
                  value={item.value}
                  onChange={(e) => saveEdit(item.uuid, e.target.value)}
                  />
                  <button
                    className={'rounded-md bg-green-500 py-1.5 px-6 text-white font-bold hover:bg-green-600'}
                    onClick={()=>saveEdit(item.uuid, item.value)}
                  >
                  Save
                  </button>
                </>
              ) : (
                <>
                  <input
                    className={twMerge(
                      'size-9 bg-zinc-200',
                      item.isDone ? 'appearance-auto' : 'appearance-none',
                    )}
                    checked={item.isDone}
                    type={'checkbox'}
                    onChange={() => handleCheck(item.uuid)}
                  />
                  <span className={'break-all'}>{item.value}</span>
                  <button
                    className={'rounded bg-red-500 h-9 px-6 text-white font-bold hover:bg-red-700'}
                    onClick={() => handleDelete(item.uuid)}
                  >
                    Delete
                  </button>
                  <button
                    className={
                      'rounded-md bg-gray-500 py-1.5 px-6 text-white font-bold hover:bg-gray-600'
                    }
                    onClick={() => toggleEdit(item.uuid)}
                  >
                    Edit
                  </button>
                </>
              )}
            </li>
          ))}
        </ul>
      </div>
      <Toaster richColors position="top-center" />
    </div>
  );
};
export default App;
