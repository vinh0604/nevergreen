var $ = require('jquery')
var ScaleText = require('scale-text')

var projectBoxHeight = 42
var projectBoxWidthFactor = 0.99

module.exports = function (saveProjects) {
    return {
        listProjects: function (config, projects) {
            $('#projects').empty()

            var sortedProjects = sortProjectsByName(projects);

            $('#projects').append('<ul />')
            sortedProjects.forEach(function (project) {
                var included = ''
                if (!config.isReady() || config.includesProject(project.name)) {
                    included = 'config-project-included'
                }

                var newNote = ''
                var newNoteClass = ''
                if (!config.previouslyFetched(project.name)) {
                    newNote = ' <sup class="config-new-project">new</sup>'
                    newNoteClass = ' new '
                }

                $('#projects ul').append('<li class="' + included + newNoteClass + ' config-project no-text-selection">' + project.name + newNote + '</li>')

                calculateCorrectFontSize(projects);
            })

            $('#projects ul li').click(function () {
                $(this).toggleClass('config-project-included')
                saveProjects()
            })
        },

        includeAll: function () {
            $('#projects ul li').addClass('config-project-included')
            saveProjects()
        },

        findIncludedProjects: function () {
            return $('.config-project-included').map(function (index, element) {
                return $(element).html().replace(' <sup>new</sup>', '') // TODO: is there a better way to do this?
            }).toArray()
        },

        excludeAll: function () {
            $('#projects ul li').removeClass('config-project-included')
            saveProjects()
        }
    }
}

function sortProjectsByName(projects) {
    return projects.sort(function (item1, item2) {
        return item1.name.toLowerCase().localeCompare(item2.name.toLowerCase())
    });
}

function calculateCorrectFontSize() {
    var width = $('ul').width() * projectBoxWidthFactor
    $('li').each(function(index, value) {
        var text = [value.textContent]
        var ideal = new ScaleText(text, projectBoxHeight, width).singleLineIdeal()
        var idealCssFontSize = Math.min(ideal, 21)
        $(value).css('font-size', idealCssFontSize)
    })
}
