import React, { useContext, useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { Firebase } from '../Context/Firebase';

const CreateTaskPage = () => {
    const [date, setDate] = useState(new Date());
    const [taskName, setTaskName] = useState("");
    const [taskDescription, setTaskDescription] = useState("");
    const [tasks, setTasks] = useState([]);
    const { addTaskToDatabase, user, getTasksByDate, updateTaskInDatabase, deleteTaskFromDatabase } = useContext(Firebase);

    useEffect(() => {
        if (user) {
            fetchTasks(date);
        }
    }, [user, date]);

    const onChange = date => {
        setDate(date);
    };

    const fetchTasks = async (date) => {
        const year = date.getFullYear();
        const month = date.getMonth() + 1;
        const day = date.getDate();
        const dateMatch = `${day}-${month}-${year}`;

        const tasks = await getTasksByDate(user.email, dateMatch);
        setTasks(tasks);
    };

    const addTaskToDB = async (e) => {
        e.preventDefault();
        const year = date.getFullYear();
        const month = date.getMonth() + 1;
        const day = date.getDate();
        const dateMatch = `${day}-${month}-${year}`;

        const description = taskDescription || "No Description Provided";
        if (taskName) {
            await addTaskToDatabase(taskName, description, dateMatch);
            setTaskName("");
            setTaskDescription("");
            fetchTasks(date);
        }
    };

    const toggleTaskCompletion = async (taskId, currentStatus) => {
        const task = tasks.find(task => task.id === taskId);
        await updateTaskInDatabase(taskId, task.taskName, task.taskDescription, !currentStatus);
        fetchTasks(date);
    };

    const deleteTask = async (taskId) => {
        await deleteTaskFromDatabase(taskId);
        fetchTasks(date);
    };

    const [editTaskId, setEditTaskId] = useState(null);
    const [editTaskName, setEditTaskName] = useState("");
    const [editTaskDescription, setEditTaskDescription] = useState("");

    const startEditing = (task) => {
        setEditTaskId(task.id);
        setEditTaskName(task.taskName);
        setEditTaskDescription(task.taskDescription);
    };

    const saveTask = async (taskId) => {
        const task = tasks.find(task => task.id === taskId);
        await updateTaskInDatabase(taskId, editTaskName, editTaskDescription, task.completed);
        setEditTaskId(null);
        fetchTasks(date);
    };

    return (
        <div className='TaskPage'>
            <div className='calendar'>
                <Calendar showWeekNumbers onChange={onChange} value={date} />
            </div>
            <div className='addTask'>
                <div className='createTask'>
                    <div className='createTaskHeading'>Create Task</div>
                    <div className='createTaskForm'>
                        <form onSubmit={addTaskToDB}>
                            <div>
                                <input
                                    type='text'
                                    placeholder='Task Name'
                                    className='taskName'
                                    value={taskName}
                                    onChange={(e) => setTaskName(e.target.value)}
                                />
                            </div>
                            <div>
                                <input
                                    type='text'
                                    placeholder='Description'
                                    value={taskDescription}
                                    onChange={(e) => setTaskDescription(e.target.value)}
                                />
                            </div>
                            <div className='buttons addtaskButton'>
                                <button type='submit' className='signup addtask'>Add Task</button>
                            </div>
                        </form>
                    </div>
                </div>
                <div className='taskList'>
                    {tasks.map(task => (
                        <div key={task.id} className={`taskItem ${task.completed ? 'completed' : ''}`}>
                            <div className='taskeItems'>
                                <input
                                    type="checkbox"
                                    checked={task.completed || false}
                                    onChange={() => toggleTaskCompletion(task.id, task.completed)}
                                />
                                {editTaskId === task.id ? (
                                    <>
                                        <input
                                            type='text'
                                            className='editTaskInput'
                                            value={editTaskName}
                                            onChange={(e) => setEditTaskName(e.target.value)}
                                        />
                                        <input
                                            type='text'
                                            className='editTaskInput'
                                            value={editTaskDescription}
                                            onChange={(e) => setEditTaskDescription(e.target.value)}
                                        />
                                        <button className='saveButton' onClick={() => saveTask(task.id)}>Save</button>
                                    </>
                                ) : (
                                    <div className='wholeSingleTask'>
                                        <div className='singleTaskItem'>
                                            <div className='taskName'>{task.taskName}</div>
                                            <div>{task.taskDescription}</div>
                                        </div>
                                        <div className='editAndDeleteButton'>
                                            <button onClick={() => startEditing(task)}><img src="editIcon.png" alt="Edit" /></button>
                                            <button onClick={() => deleteTask(task.id)}><img src="deleteIcon.png" alt="Delete" /></button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default CreateTaskPage;
