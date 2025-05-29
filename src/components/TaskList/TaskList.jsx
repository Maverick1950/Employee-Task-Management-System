/* eslint-disable react/prop-types */
import AcceptTask from "./AcceptTask";
import CompleteTask from "./CompleteTask";
import FilledTask from "./FilledTask";
import NewTask from "./NewTask";

const TaskList = ({ data, onUpdateTaskStatus }) => {
  return (
    <div
      id="tasklist"
      className="flex overflow-x-auto items-center justify-start gap-5 flex-nowrap h-[50%] py-5 w-full mt-10"
    >
      {data.tasks.map((elem, id) => {
        if (elem.active) {
          return (
            <AcceptTask
              key={id}
              elem={elem}
              onUpdateTaskStatus={onUpdateTaskStatus}
            />
          );
        }
        if (elem.newTask) {
          return <NewTask key={id} elem={elem}
                        onUpdateTaskStatus={onUpdateTaskStatus}
 />;
        }
        if (elem.completed) {
          return <CompleteTask key={id} elem={elem}
                        onUpdateTaskStatus={onUpdateTaskStatus}
 />;
        }
        if (elem.failed) {
          return <FilledTask key={id} elem={elem} 
                        onUpdateTaskStatus={onUpdateTaskStatus}
/>;
        }
        return null;
      })}
    </div>
  );
};

export default TaskList;
