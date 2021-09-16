new Vue({
	el : "#todoapp",
	data : {
		newTaskLabel : "",
		newTaskCategory : "",
		newTaskDueDate : "",
		newTaskPriority : 0,
		state : "view",
		sortByLabelState : 0,
		sortByCategoryState : 0,
		sortByDueDateState : 0,
		sortByPriorityState : 0,
		tasks : [{label : "Complete Project",
					category : "Career",
					dueDate : "1999-11-15",
					priority : 0,
					class : "",
					complete : false},
				{label : "Walk the Dog",
					category : "Household",
					dueDate : "1999-11-15",
					priority : 1,
					class: "priority1",
					complete : false},
				{label : "Wash the dishes",
					category : "Household",
					dueDate : "1999-11-15",
					priority : 2,
					class : "priority2",
					complete : false}]
	},
	methods : {
		addTask() {
			this.tasks.push({label : this.newTaskLabel,
				category : this.newTaskCategory,
				dueDate : this.newTaskDueDate,
				priority : this.newTaskPriority,
				class : this.calcClass(this.newTaskPriority, false),
				complete : false})
			this.newTaskLabel = "";
			this.newTaskCategory = "";
			this.newTaskDueDate = "";
			this.newTaskPriority = 0;

			this.saveTasks();
		},
		calcClass(priority, complete) {
			var stringClass;

			if (complete)
				return ("strikethrough");
			
			if (priority) {
				stringClass = "priority" + priority.toString();
				return (stringClass);
			}
			
			return ("");
		},
		changeState(newState) {
			this.state = newState;
		},
		deleteTask(task) {
			this.tasks = this.tasks.filter(function(value, index, tasks){
				return (value.label != task.label);
			})

			this.saveTasks();
		},
		changeSortState(selectedState) {
			if (selectedState === "label") {
				this.sortByLabelState = (this.sortByLabelState + 1) % 3
				console.log(this.sortByLabelState)
			}
			if (selectedState === "category") {
				this.sortByCategoryState = (this.sortByCategoryState + 1) % 3
				console.log(this.sortByCategoryState)
			}
			if (selectedState === "due date") {
				this.sortByDueDateState = (this.sortByDueDateState + 1) % 3
				console.log(this.sortByDueDateState)
			}
			if (selectedState === "priority") {
				this.sortByPriorityState = (this.sortByPriorityState + 1) % 3
				console.log(this.sortByPriorityState)
			}
		},
		compareTasks(taskToInsert, taskCurrent, field, sortState) {
			var str1;
			var str2;

			if (field === "label") {
				str1 = taskToInsert.label;
				str2 = taskCurrent.label;
			}
			if (field === "category") {
				str1 = taskToInsert.category;
				str2 = taskCurrent.category;
			}
			if (field === "date") {
				str1 = taskToInsert.dueDate;
				str2 = taskCurrent.dueDate;
			}
			if (field === "priority") {
				str1 = taskToInsert.priority.toString();
				str2 = taskCurrent.priority.toString();
			}

			console.log("str1: " + str1 + " str2: " + str2)
			if (sortState === 1) {
				console.log("True if str2 < str1");
				console.log(str2.localeCompare(str1))
				if (0 < str2.localeCompare(str1))
					return (true)
			}
			if (sortState === 2) {
				console.log("True if str1 > str2");
				console.log(str1.localeCompare(str2))
				if (0 < str1.localeCompare(str2))
					return (true)
			}
			return (false);
		},
		sortBy(list, field, sortState) {
			//Insertion Sort
			var newList = [];
			newList.push(list[0]);

			i = 1;
			while (list[i]){
				j = 0;
				//Element that needs to be inserted into the new list
				taskToInsert = list[i];
				console.log("Item to be Inserted: " + taskToInsert.label);
				while (newList[j]) {
					//Compare against each element in the new list
					taskCurrent = newList[j];
					console.log("Item to be Compared: " + taskCurrent.label)
					//If the current task's relevant field is less than (or more than) the taskToInserted's relavenat
					// field, insert the task to the new list
					if (this.compareTasks(taskToInsert, taskCurrent, field, sortState)) {
						console.log("INSERT TASK");
						newList.splice(j, 0, taskToInsert);
						break ;
					}

					//If the task is the last task then append the task to the new list
					if (!newList[j + 1]) {
						console.log("END OF LIST : INSERT TASK");
						newList.push(taskToInsert);
						break ;
					}
					j++;
				}
				i++;
			}
			console.log("newList:")
			i = 0;
			while (newList[i]) {
				console.log(newList[i].label);
				i++;
			}
			return (newList)
		},
		toggleComplete(task) {
			if (this.state === "view")
				task.complete = !task.complete;

			task.class = this.calcClass(task.priority, task.complete);
		},
		saveTasks() {
			const strTasks = JSON.stringify(this.tasks);

			console.log(strTasks);
			localStorage.setItem('tasks', strTasks);
		},
		log() {
			console.log("success");
		}
	},
	computed : {
		sortedList() {
			//Using local Variables for shorthand
			lbl = this.sortByLabelState;
			ctg = this.sortByCategoryState;
			date = this.sortByDueDateState;
			prty = this.sortByPriorityState;
			activeFields = (lbl << 6) + (ctg << 4) + (date << 2) + prty;

			//If the user has not selected a field to sort by display the reversed list
			if (!activeFields)
				return (this.tasks.slice(0).reverse());
			
			//Order of importance: Category, Due Date, Priority, Label
			//By sorting the list in order of least to most relevant, the final list will be properly ordered
			//i.e. label->category = each group of items in the same category will be adjacent and sorted alphebetically by label
			/*i.e : ***		AAAAAAAAA
					AAA		Household
					BBB		Household
					CCC		Household
					***		ZZZZZZZZZ
			*/
			list = this.tasks.slice(0).reverse();
			if (lbl)
				list = this.sortBy(list, "label", lbl)
			if (prty)
				list = this.sortBy(list, "priority", prty)
			if (date)
				list = this.sortBy(list, "date", date)
			if (ctg)
				list = this.sortBy(list, "category", ctg)
			return(list)
		}
	},
	mounted() {
		if (localStorage.sortByLabelState)
			this.sortByLabelState = localStorage.sortByLabelState;

		if (localStorage.sortByCategoryState)
			this.sortByCategoryState = localStorage.sortByCategoryState;

		if (localStorage.sortByDueDateState)
			this.sortByDueDateState = localStorage.sortByDueDateState;

		if (localStorage.sortByPriorityState)
			this.sortByPriorityState = localStorage.sortByPriorityState;

		if (localStorage.tasks) {
			try {
				console.log(this.tasks);
				this.tasks = JSON.parse(localStorage.getItem('tasks'));
				console.log(this.tasks);
			} catch(e) {
				localStorage.removeItem('tasks');
			}
		}
	},
	watch : {
		newTaskCategory(newCategory) {
			localStorage.category = newCategory;
		}
	}
})  