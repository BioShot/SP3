jQuery(function($) {
    function progress(percent, width) {
        var size = Math.round(width*percent/100);
        var left = '', taken = '', i;
        for (i=size; i--;) {
            taken += '=';
        }
        if (taken.length > 0) {
            taken = taken.replace(/=$/, '>');
        }
        for (i=width-size; i--;) {
            left += ' ';
        }
        return '[' + taken + left + '] ' + percent + '%';
    }
    var animation = false;
    var timer;
    var prompt;
    var string;
    $('body').terminal(function(command, term) {
        var cmd = $.terminal.parse_command(command);
        if (cmd.name == 'boot') {
            term.echo("Loading Dependencies...");
            var i = 0, size = 250;
            prompt = term.get_prompt();
            string = progress(0, size);
            term.set_prompt(progress);
            animation = true;
            (function loop() {
                string = progress(i++, size);
                term.set_prompt(string);
                if (i < 100) {
                    timer = setTimeout(loop, 150);
                } else {
                    term.echo(progress(i, size) + ' [[b;green;]OK]')
                        .set_prompt(prompt);
                    animation = false
                    term.echo("[[b;green;]ALL 250 Dependencies Loaded!]");
                    term.echo("Checking APKS...");
                    setTimeout(() => {
                        term.error("MISSING 1 APK(BioTerm.apk)!");
                        setTimeout(() => {
                            term.error("CANNOT CONVERT WINDOWS EXE TO ANDROID APK! Skipping APK.");
                            setTimeout(() => {
                                term.echo("Gathering Data from android device...");
                                setTimeout(() => {
                                    term.error("GATHER FAILED! Because Developer of program disabled it! Skipping Step!");
                                    setTimeout(() => {
                                        term.echo("[[b;red;]Faild to launch: CRAM OS Desktop] Searching for application [[b;green;]App Found: SP3PLAYER!]");
                                        setTimeout(() => {
                                            term.echo("Launching Program: [[b;green;]SP3PLAYER.]");
                                            setTimeout(() => {
                                                document.location.assign("App/load.html");
                                            }, 1000);
                                        }, 1000);
                                    }, 1000);
                                }, 1000);
                            }, 1000);
                        }, 1000);
                    }, 1000);
                    }
                })();
                

        }
    }, {
        keydown: function(e, term) {
            if (animation) {
                if (e.which == 68 && e.ctrlKey) { // CTRL+D
                    clearTimeout(timer);
                    animation = false;
                    term.echo(string + ' [[b;red;]FAIL]')
                        .set_prompt(prompt);
                }
                return false;
            }
        },
        greetings: greetings.innerHTML,
    });
});