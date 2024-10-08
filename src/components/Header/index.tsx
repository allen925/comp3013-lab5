import styles from "./header.module.css";
import { AiOutlinePlusCircle, AiOutlineCalendar } from "react-icons/ai";
import { uppercase, formatDate } from "../../helpers/helpers";
import { useEffect, useRef, useState } from "react";
import { TaskType } from '../../helpers/type';
import { Calendar } from "../Calendar";

type HeaderProps = {
  setTasks: React.Dispatch<React.SetStateAction<TaskType[]>>;
};

export function Header({ setTasks }: HeaderProps) {
  const [answer, setAnswer] = useState<string>('');
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (answer == '' && e.target.value == ' ')
      return;
    setAnswer(e.target.value);
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (answer) {
      setTasks(prevTasks => [...prevTasks, { description: answer, completed: false, dueDate: selectedDate }]);
      setAnswer('');
    } else {
      setError('Please enter a valid task name.');
    }
  }

  const calendarRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (calendarRef.current && !calendarRef.current.contains(event.target as Node))
        setIsPickerOpen(false);
    };

    if (isPickerOpen) {
      document.addEventListener('click', handleOutsideClick);
    } else {
      document.removeEventListener('click', handleOutsideClick);
    }

    // Cleanup the event listener unmounts / closes
    return () => {
      document.removeEventListener('click', handleOutsideClick);
    };
  }, [isPickerOpen]);

  return (
    <header className={styles.header}>
      {/* This is simply to show you how to use helper functions */}
      <h1>
        {/* {uppercase("bcit")}  */}
        Task Tracker
      </h1>
      <form className={styles.newTaskForm} onSubmit={handleSubmit}>
        <input placeholder="Add a new task" type="text" value={answer} onChange={handleInputChange} />
        <div ref={calendarRef}>
          <button type="button" className={styles.button + ' ' + styles.toggleButton + ' ' + styles.anchor} onClick={() => setIsPickerOpen(prev => !prev)}>
            {selectedDate ? formatDate(selectedDate) : <AiOutlineCalendar size={20} />}
          </button>
          {isPickerOpen && (
            <Calendar selectedDate={selectedDate} setSelectedDate={setSelectedDate} setIsPickerOpen={setIsPickerOpen} />
          )}
        </div>
        {/* hide date picker if clicked on it. */}
        <div style={{ display: "inline-block", position: "relative" }}>
          <button className={styles.button} disabled={!answer}>
            Create <AiOutlinePlusCircle size={20} />
          </button>
          {!answer && (
            <div style={{
              position: "absolute",
              left: 0,
              right: 0,
              top: 0,
              bottom: 0,
              cursor: "not-allowed",
              pointerEvents: "auto",
              zIndex: 10
            }} />
          )}
        </div>
      </form>
      {error && <p className={styles.error}>{error}</p>}
    </header>
  );
}
