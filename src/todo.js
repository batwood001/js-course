(function () {
	
	window.TodoApp = {}

	// View-Model
	
	TodoApp.vm = {
		todos: m.prop([])
	}

	TodoApp.find = function (id) {
		var todos = TodoApp.vm.todos()
		for (var i = 0; i < todos.length; i++) {
			if (todos[i].id === id) return todos[i]
		}
	}

	TodoApp.controller = function () {
		var ctrl = {}
		
		ctrl.updateTodo = function (id, isComplete) {
			console.log("Updated")
			var todo = TodoApp.find(id)
			todo.isComplete = isComplete
		}

		ctrl.flip = function () {
			TodoApp.vm.todos().forEach(function(todo) {
				todo.isComplete = !todo.isComplete
			})
		}
		return ctrl
	}

	TodoApp.view = function (ctrl) {
		return m('.todos', [
			TodoApp.vm.todos().map(todoView),
			m('button', {onclick: ctrl.flip}, "Flip All Todos")
			
		])

		function todoView (todo) {
			return m('.todo', [
				m('input[type=checkbox]', {
					checked: todo.isComplete,
					// function (id, isComplete)
					onchange: ctrl.updateTodo.bind(null, todo.id, !todo.isComplete),

					onchange: function (e) {
						ctrl.updateTodo(todo.id, !todo.isComplete)
					}
				}),
				m('label', todo.name)
				// Checkbox
				// Label
				// Bind click action to controller
			])
		}
	}
})()