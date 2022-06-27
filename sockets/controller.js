

const socketController=(socket) =>{
  console.log("Connected to socket.io id: "+socket.id);

  socket.on('open project',(project) =>{
    socket.join(project)
  })
  socket.on('new task',(task) =>{
    const project = task.project;
    socket.to(project).emit('task added',task)
  })
  socket.on('delete task',task =>{
    const project = task.project;
    socket.to(project).emit('task-deleted',task)
  })
  socket.on('update-task',task =>{
    const project = task.project._id;
    socket.to(project).emit('task-updated',task)
  })
  socket.on('change-status-task',task =>{
    const project = task.project._id;
    socket.to(project).emit('changed-status-task',task)
  })


}

module.exports={
  socketController
}