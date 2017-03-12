


block script
	// NOTE: put the dot after script(). and the js is rendered only for client interpretation
	script().
		var html
		var pix_idx = 0;
		var project_pix = ["https://avatars1.githubusercontent.com/u/8534106?v=3&s=200", "https://avatars1.githubusercontent.com/u/8534106?v=3&s=200", "http://i.imgur.com/JUmCJ5L.png", "http://i.imgur.com/KOY0XD0.jpg", "https://avatars1.githubusercontent.com/u/8534106?v=3&s=200",
		"https://avatars1.githubusercontent.com/u/8534106?v=3&s=200"];

		jQuery(document).ready(function () {

			//
			// The first $.ajax retrieves matchresults, an array of
			// objects containing an array of project names and matching scores for a
			//  given set of user-specified skills, goals and interests
			//
			// data model describe in matching_results_matching.txt
			//
			//

			jQuery.ajax({
				url: '/api/user/matches?skills=javascript,python&interests=housing&goals=developer,presenter'
			}).done(function (matchresults) {
				if (typeof matchresults.projects !== 'undefined' && matchresults.projects[0]) {
					spitOutSkillIntGoalSelectors(matchresults);

					// Interest/skill/goal selections are now output
					// Next come the matching projects
					// Run through the matching project array, and output details
					// in the project list style.
					//
					// Because the matching results do not return project details,
					// a second jQuery must be called to retrieve project details
					// This should be changed in a subsequent iteration so that
					// the matching results return all the project data needed in
					// one API call.

					for (q = 0; q < matchresults.projects.length; q++) {
						console.log(matchresults.projects[q].id);
						listMatchingProjects(matchresults.projects[q]);
					}

				}
				}).fail(function (err) {
				console.error(err); return;
			});
		})

		function listMatchingProjects(matchingProject) {

			jQuery.ajax({
				url: '/api/projects'

				//
				// For now, retrieving all projects and then selecting
				// the matching information to output.
				// Projects object here are returned as var "results"
				// The matching query should instead return project details.
				//

			}).done(function (results) {
				//
				// This looping should be replaced by having the matching wizard return the necessary // project details in its API
				//
				var proj_exists = 'false';
				html = '';
				if (typeof results.projects !== 'undefined' && results.projects[0]) {
					results.projects.forEach(function (proj, idx) {
						if(proj.name === matchingProject.id) { // this is a hit, add details and output
							//showProjListHeadings() //Contact Team, Team Leader, Project Name etc

							console.log('matchingProject.id is ', matchingProject.id, proj.name)
							outputProjectInfo(proj);
							proj_exists = 'true';
						}
					})

					if (proj_exists === 'false') {   //This should only occur with test data
						//showProjListHeadings()
						console.log('Not found project matchingProject.id is', matchingProject.id);
						outputNotFoundInfo(matchingProject);

					}
				}

				// click event listener placed on class "message-team" buttons
				//
				$('.message-team').on('click', function(e) {
					showContactForm(e);
				})

				// click event on the contact form "X" element on click
				// Need to show clickability in cursor
				//
				$('#cancelform').on('click', function(e) {
					cancelContactForm(e);
				})

			}).fail(function (err) {
				console.error(err); return;
			})
		}

		function showContactForm(e) {
			prefillContactForm();
			$( '.send-msg--hidden').removeClass('send-msg--hidden').addClass('send-msg--visible');
		}

		function cancelContactForm(e) {
			$( '.send-msg' ).removeClass('send-msg--visible').addClass('send-msg--hidden');
		}

		function prefillContactForm() {
			document.getElementById("comment").placeholder = "Send a message and questions to the Team Leader using this email form. \n\n We will not reveal your email address (it will be anonymized), but you will receive a reply directly to the email you checked in with. \n\n Your goals, skills and interests as given to the matching wizard will be appended to your message automatically. \n\n <em>Go ahead and start a conversation about how you can help!</em>"
		}

		function outputNotFoundInfo(projNotFound) {
			var not_proj = {}
				not_proj.name = projNotFound.id,
				not_proj.description = 'I need a mission statement!';
				not_proj.matchingConfig = {};
			outputProjectInfo(not_proj);
		}

		function outputProjectInfo(proj) {
			//
			html+= '<div class="projects-list__project-container"><div class="row row__projects-list--info-2">';

			html+= '<section class="col-xs-2 col-xs-push-0"><img class="project-thumbnail" src="' + project_pix[ pix_idx ] + '" alt="Project Image Here" title="Project Image Here"></img></section>';
			pix_idx++;
			html+= '<section class="col-xs-4 col-xs-push-0">';
			html+= '<button title="email the team leader" class="message-team btn btn-primary">Contact this Team</button>';
			html+= '</section>';
			html+= '<section class="col-xs-6 col-xs-push-0">';
			html+= '<span class="row text-center">' + 'Project Leader\'s Name' + '</span></section></div>';

			html+= '<div class="row row__projects-list--info-2">';
			html+= '<section class="col-xs-2 col-xs-push-0"></section>';

			html+= '<section class="col-xs-4 col-xs-push-0">';
			html+= '<span class="row text-center">' + proj.name + '</span></section>';

			html+= '<section class="col-xs-6 col-xs-push-0">';
			html+= '<span class="row">' + proj.description + ' This project needs a mission statement showing how the team will foster social progress.' + '</span></section></div>';

			var Configs = proj.matchingConfig;
			html+= '<div class="row row__projects-list--cfg">';  //Start next row for the same project - configs
			//
			// Print out the project needs/interest headings
			//
			html+= '<section class="section__matchGoal col-xs-4 col-xs-push-0">';
			html+= '<span class="row text-center"><strong> ' + 'Seeking: ' + '</strong></span></section>';
			html+= '<section class="section__matchSkill col-xs-4 col-xs-push-0">';
			html+= '<span class="row text-center"><strong> ' + 'Skills Needed: ' + '</strong></span></section>';
			html+= '<section class="section__matchInterest col-xs-4 col-xs-push-0">';
			html+= '<span class="row text-center"><strong> ' + 'Our Areas of Focus: ' + '</strong></span></section>';
			html+= '</div>';
			//
			// Print out the goals / skills / interests
			//
			var Configs = proj.matchingConfig;
			html+= '<div class="row row__projects-list--cfg">';  //Start next row for the same project - configs
			var cfgClass = ['section__matchGoal', 'section__matchSkill', 'section__matchInterest'];
			var i=0;
			Object.keys(Configs).forEach(key => {
				html+= '<section class="' + cfgClass[i] + ' col-xs-4 col-xs-push-0">'  //start section
				i++
				for(k = 0; k < proj.matchingConfig[key].length; k++ ) {
					html+= '<span class="capital">' + proj.matchingConfig[key][k] + ' ' + '</span>';
				}
				html+= '</section>'; //close the section for this category of matching configs
			})
			html+= '</div>'; //close project needs
			html+= '</div>'; //close projects-list__project-container div
			html+= '<div "class=row row--separator"><br /></div>';
			jQuery('#projects-list').append(html);


		}

		function showProjListHeadings() {

			html = '';
			html+= '<div class="row__projects-list-box">'; //contain entire project
			html += '<div class="row  row__projects-list--info">';
			html+= '<section  class="text-center col-xs-2 col-xs-push-0">';
			html+= '<span>Contact</span></section>';

			html+= '<section class="col-xs-3 col-xs-push-0">';
			html+= '<span class="text-center">Team Leader</span></section>';
			html+= '<section class="col-xs-3 col-xs-push-0">';
			html+= '<span class="text-center">Project Name</span></section>';

			html+= '<section class="col-xs-4 col-xs-push-0">';
			html+= '<span class="text-center">Project Mission Statement</span></section></div>';

			//jQuery('#projects-list').append(html);

			}

			//Handle email form submit event. For now,  we just clear any user-entered text from form and display a confirming message.
			//
			$(document).ready(function(){
				$("form").submit(function(e){
					e.preventDefault();
					$('#confirm_sent').css("visibility", "visible" );
					$('#comment').val('').blur(); //erase the input and replace placeholder
					$( "div.send-msg" ).removeClass('send-msg--visible').addClass('send-msg--hidden');
					setTimeout(function() {
						$('#confirm_sent').css("visibility", "hidden" );
					}, 4000);

				})

			});

			function spitOutSkillIntGoalSelectors(matchresults) {
				var html = '<div class="row match-cfg-heading">';
				html+= '<section class="section__matchGoal col-sm-4 col-xs-push-0"><h3 class="config">Goals</h3></section>';
				html+= '<section class="section__matchSkill col-sm-4 col-xs-push-0"><h3 class="config">Skills</h3></section>';
				html+= '<section class="section__matchInterest col-sm-4 col-xs-push-0"><h3 class="config">Interests</h3></section>';
				//html+= '</div>';
				//jQuery('#matchingConfigs-list').append(html);
				//html = '<div class="row mitem">';
				html+= '<span class="row">'
				html+= '<section class="section__matchGoal col-sm-4 col-xs-push-0">';
					for (i = 0; i < matchresults.goals.length; i++ ) {
						html += '<span class="mitem">' + matchresults.goals[i] + '</span>';
					}
					html += '</section>';
					html+= '<section class="section__matchSkill col-sm-4 col-xs-push-0">';
					for (i = 0; i < matchresults.skills.length; i++ ) {
						html += '<span class="mitem">' + matchresults.skills[i] + '</span>';
					}
					html += '</section>';
					html+= '<section class="section__matchInterest col-sm-4 col-xs-push-0">';
					for (i = 0; i < matchresults.interests.length; i++ ) {
						html += '<span class="mitem">' + matchresults.interests[i] + '</span>';
					}
				html += '</span></section>';
				html+= '</div>';
				jQuery('#matchingConfigs-list').append(html);

			}
