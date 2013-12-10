/*global jQuery, Handlebars */
jQuery(function ($) {
	'use strict';

	var Utils = {
		uuid: function () {			//Creates a unique id number for the goals
			/*jshint bitwise:false */
			var i, random;
			var uuid = '';

			for (i = 0; i < 32; i++) {
				random = Math.random() * 16 | 0;
				if (i === 8 || i === 12 || i === 16 || i === 20) {
					uuid += '-';
				}
				uuid += (i === 12 ? 4 : (i === 16 ? (random & 3 | 8) : random)).toString(16);
			}

			return uuid;
		},
		store: function (namespace, data) {	//Stores the goals into localStorages
			if (arguments.length > 1) {
				return localStorage.setItem(namespace, JSON.stringify(data));
			} else {
				var store = localStorage.getItem(namespace);
				return (store && JSON.parse(store)) || [];
			}
		}
	};

	var App = {
		init: function () {
			this.ENTER_KEY = 13;
			this.goals = Utils.store('goals-jquery');
			this.cacheElements();
			this.bindEvents();
			this.render();
			this.checkforNewDay();
		},
		checkforNewDay: function() {
			//App.goals[1].current_streak = 7;
			for (var i = 1; i < this.goals.length ; i++)
			{
				var dxx = new Date();
				var startxx = new Date(dxx.getFullYear(), 0, 0);
				var diffxx = dxx - startxx;
				var oneDayxx = 1000 * 60 * 60 * 24;
				var last_saved_dayxx = Math.floor(diffxx / oneDayxx);
				var ifpos = last_saved_dayxx-App.goals[i].last_saved_day;
				var ifneg = 365-App.goals[i].last_saved_day+last_saved_dayxx;
				if (last_saved_dayxx > App.goals[i].last_saved_day)
				{
					for (var j = 0 ; j < ifpos ; j++)
					{
						App.goals[i].day1=App.goals[i].day2;
						App.goals[i].day2=App.goals[i].day3;
						App.goals[i].day3=App.goals[i].day4;
						App.goals[i].day4=App.goals[i].day5;
						App.goals[i].day5=App.goals[i].day6;
						App.goals[i].day6=App.goals[i].day7;
						App.goals[i].day7=false;
						App.goals[i].current_day++;
						App.goals[i].dd++;
						App.goals[i].last_saved_day= App.goals[i].dd;
						App.goals[i].day7_label= App.goals[i].weekday3[App.goals[i].dd%7];
						App.goals[i].day6_label= App.goals[i].weekday1[(App.goals[i].dd +6)%7];
						App.goals[i].day5_label= App.goals[i].weekday1[(App.goals[i].dd +5)%7];
						App.goals[i].day4_label= App.goals[i].weekday1[(App.goals[i].dd +4)%7];
						App.goals[i].day3_label= App.goals[i].weekday1[(App.goals[i].dd +3)%7];
						App.goals[i].day2_label= App.goals[i].weekday1[(App.goals[i].dd +2)%7];
						App.goals[i].day1_label= App.goals[i].weekday1[(App.goals[i].dd +1)%7];
					}
				}
				if (last_saved_dayxx < App.goals[i].last_saved_day)
				{
					for (var k = 0; k < ifneg; k++)
					{
						App.goals[i].day1=App.goals[i].day2;
						App.goals[i].day2=App.goals[i].day3;
						App.goals[i].day3=App.goals[i].day4;
						App.goals[i].day4=App.goals[i].day5;
						App.goals[i].day5=App.goals[i].day6;
						App.goals[i].day6=App.goals[i].day7;
						App.goals[i].day7=false;
						App.goals[i].current_day++;
						App.goals[i].dd++;
						App.goals[i].last_saved_day= App.goals[i].dd;
						App.goals[i].day7_label= App.goals[i].weekday3[App.goals[i].dd%7];
						App.goals[i].day6_label= App.goals[i].weekday1[(App.goals[i].dd +6)%7];
						App.goals[i].day5_label= App.goals[i].weekday1[(App.goals[i].dd +5)%7];
						App.goals[i].day4_label= App.goals[i].weekday1[(App.goals[i].dd +4)%7];
						App.goals[i].day3_label= App.goals[i].weekday1[(App.goals[i].dd +3)%7];
						App.goals[i].day2_label= App.goals[i].weekday1[(App.goals[i].dd +2)%7];
						App.goals[i].day1_label= App.goals[i].weekday1[(App.goals[i].dd +1)%7];
					
					}
				}
				App.goals[i].last_saved_day = last_saved_dayxx;
			}
			App.render();
		},
		cacheElements: function () {
			this.goalTemplate = Handlebars.compile($('#goal-template').html());
			this.$goalApp = $('#goalapp');
			this.$goalHome = this.$goalApp.find('#goal-home');
			this.$goalAdd = this.$goalApp.find('#goal-add');
			this.$newGoal = this.$goalAdd.find('#new-goal');
			this.$goalList = this.$goalHome.find('#goal-list');
		},
		bindEvents: function () {
			var list = this.$goalList;
			this.$newGoal.on('focusout', this.create);	//Binds the create function
			list.on('keypress', '.edit', this.blurOnEnter);	//Binds the blur on enter function
			list.on('blur', '.edit', this.updateName);	//Binds the name update function
			list.on('click', '.destroy', this.destroy);	//Binds the destroy goal function
			list.on('change', '.checkDay1', this.checkDay1);	//Binds the checkbox functions
			list.on('change', '.checkDay2', this.checkDay2);
			list.on('change', '.checkDay3', this.checkDay3);
			list.on('change', '.checkDay4', this.checkDay4);
			list.on('change', '.checkDay5', this.checkDay5);
			list.on('change', '.checkDay6', this.checkDay6);
			list.on('change', '.checkDay7', this.checkDay7);
			list.on('change', '.checkDay1', this.update);	//Binds the checkbox functions
			list.on('change', '.checkDay2', this.update);
			list.on('change', '.checkDay3', this.update);
			list.on('change', '.checkDay4', this.update);
			list.on('change', '.checkDay5', this.update);
			list.on('change', '.checkDay6', this.update);
			list.on('change', '.checkDay7', this.update);
			this.$newGoal.one('focusin', this.createfirst);			//One time bind the list initializer function
		},
		render: function () {	//Renders the app
			this.$goalList.html(this.goalTemplate(this.goals));
			
			Utils.store('goals-jquery', this.goals);
			$("#goal-list").listview('refresh');
			$('#goalapp').trigger('create');
		},
		// accepts an element from inside the `.item` div and
		// returns the corresponding goal in the goals array
		getGoal: function (elem, callback) {	//Reads goal by element id and passes it 
			var id = $(elem).closest('li').data('id');

			$.each(this.goals, function (i, val) {
				if (val.id === id) {
					callback.apply(App, arguments);
					return false;
				}
			});
		},
		create: function (e) {	//Creates a new goal
			var $input = $(this);
			var val = $.trim($input.val());

			if (!val) {
				return;
			}
			
			var d = new Date();
			var x = d.getDay();
			var weekday1x = new Array("S","M","T","W","T","F","S");
			var weekday3x = new Array('Sun','Mon','Tue',"Wed","Thu","Fri","Sat");	
			var day7_labelx = weekday3x[x];
			var day6_labelx = weekday1x[(x+6)%7];
			var day5_labelx = weekday1x[(x+5)%7];
			var day4_labelx = weekday1x[(x+4)%7];
			var day3_labelx = weekday1x[(x+3)%7];
			var day2_labelx = weekday1x[(x+2)%7];
			var day1_labelx = weekday1x[(x+1)%7];
			var start = new Date(d.getFullYear(), 0, 0);
			var diff = d - start;
			var oneDay = 1000 * 60 * 60 * 24;
			var last_saved_dayx = Math.floor(diff / oneDay);
			App.goals.push({
				id: Utils.uuid(),
				title: val,
				day1: false,
				day2: false,
				day3: false,
				day4: false,
				day5: false,
				day6: false,
				day7: false,
				weekday1: new Array("S","M","T","W","T","F","S"),
				weekday3: new Array('Sun','Mon','Tue',"Wed","Thu","Fri","Sat"),
				dd: x,
				last_saved_day: last_saved_dayx,
				day7_label: day7_labelx,
				day6_label: day6_labelx,
				day5_label: day5_labelx,
				day4_label: day4_labelx,
				day3_label: day3_labelx,
				day2_label: day2_labelx,
				day1_label: day1_labelx,
				current_day: 0,
				current_streak: 0,
				max_streak: 0,
				checks: new Array(),
			});
					
			$input.val('');
			$.mobile.changePage( "#home", { transition: "slide", changeHash: true });
			App.render();
		},
		checkDay1: function () {	//Sees if the first checkmark is checked
			App.getGoal(this, function (i, val) {
				val.day1 = !val.day1;
			});
			App.render();
		},
		checkDay2: function () {	//Same for the second
			App.getGoal(this, function (i, val) {
				val.day2 = !val.day2;
			});
			App.render();
		},
		checkDay3: function () {	//You get the idea
			App.getGoal(this, function (i, val) {
				val.day3 = !val.day3;
			});
			App.render();
		},
		checkDay4: function () {	//I hope
			App.getGoal(this, function (i, val) {
				val.day4 = !val.day4;
			});
			App.render();
		},
		checkDay5: function () {	//Because theses function names are self-describing
			App.getGoal(this, function (i, val) {
				val.day5 = !val.day5;
			});
			App.render();
		},
		checkDay6: function () {	//So if you don't get it, why are you teaching this class?
			App.getGoal(this, function (i, val) {
				val.day6 = !val.day6;
			});
			App.render();
		},
		checkDay7: function () {	//Or why are you reading this
			App.getGoal(this, function (i, val) {
				val.day7 = !val.day7;
			});
			App.render();
		},
		blurOnEnter: function (e) {	//Blurs on the enter key
			if (e.which === App.ENTER_KEY) {
				e.target.blur();
			}
		},
		updateName: function () {	//Updates the name of a goal
			var val = $.trim($(this).removeClass('editing').val());

			App.getGoal(this, function (i) {
				if (val) {
					this.goals[i].title = val;
				} else {
					this.goals.splice(i, 1);
				}
				this.render();
			});
		},
		
		update: function () {
			App.getGoal(this, function (i, val) {
				val.current_streak=0;
				val.max_streak=0;
				var r;
				for (var i=0;i<=val.current_day;i++)
				{	
					if (i == 0)
					{
						r = val.current_day-i;
						val.checks[r] = val.day7;
					}
					if (i == 1)
					{
						r = val.current_day-i;
						val.checks[r] = val.day6;
					}
					if (i == 2)
					{
						r = val.current_day-i;
						val.checks[r] = val.day5;
					}
					if (i == 3)
					{
						r = val.current_day-i;
						val.checks[r] = val.day4;
					}
					if (i == 4)
					{
						r = val.current_day-i;
						val.checks[r] = val.day3;
					}
					if (i == 5)
					{
						r = val.current_day-i;
						val.checks[r] = val.day2;
					}
					if (i == 6)
					{
						r = val.current_day-i;
						val.checks[r] = val.day1;
					}
				}
				for (i=0;i<(val.current_day+1);i++)
				{
					if (val.checks[i] == true)
					{	
						val.current_streak++;
						if (val.current_streak >= val.max_streak)
						{
							val.max_streak = val.current_streak;
						}
					}
					else
					{
						val.current_streak = 0;
					}
				}
			});
			App.render();
			},

		
		destroy: function () {		//Destroys a goal
			App.getGoal(this, function (i) {
				this.goals.splice(i, 1);
				$('.advanced').hide();
				this.render();
			});
		},
		createfirst: function (e) {	//Initializes the goal list
			var $input = $(this);
			var val = $.trim($input.val());
			
			if (localStorage.getItem("listinitializer") == "y"){	//If it already has been initialized, stop
				return;
			}
		
			/*if (e.which !== App.ENTER_KEY || !val) {
				return;
			}*/

			App.goals.push({
				id: Utils.uuid(),
				title: val,
				day1: false,
				day2: false,
				day3: false,
				day4: false,
				day5: false,
				day6: false,
				day7: false
			});

			$input.val('');
			localStorage.setItem("listinitializer", "y");	//Prevent the goal list from being initialized again
			

		},
		
	};

	App.init();
});
