///*jslint vars: true, plusplus: true, devel: true, nomen: true, regexp: true, indent: 4, maxerr: 50 */
///*global define, $, brackets */
//
///** Simple extension that adds a "File > Hello World" menu item. Inserts "Hello, world!" at cursor pos. */

define(function (require, exports, module) {    
    "use strict";
    
    var CommandManager = brackets.getModule("command/CommandManager"),
        EditorManager  = brackets.getModule("editor/EditorManager"),
        Menus          = brackets.getModule("command/Menus"),
        Dialogs = brackets.getModule("widgets/Dialogs");
    
    
    function showNotification(message) {
        var dialog = Dialogs.showModalDialog(
                        "notification-dialog",  // Unique ID for the dialog
                        "Clean Canvas",         // Title of the dialog
                        message,                // Content of the dialog
                        [{                      // Button configuration
                          className: Dialogs.DIALOG_BTN_CLASS_PRIMARY,
                          id: Dialogs.DIALOG_BTN_OK,
                          text: "OK",
                          click: function() {
                            dialog.close();
                          }
                        }],
                        true                   // Dialog can be dismissed with the Escape key
                      );
    }
    // Function to run when the menu item is clicked
    function handleHelloWorld() {     
        var editor = EditorManager.getFocusedEditor();
        
        var html_code = editor.document.file._contents;
        
        $.ajax({
          url: 'https://iq33vfcxl8.execute-api.us-east-1.amazonaws.com/default/parseHtml',
          method: 'POST',
          data: JSON.stringify({
                html: html_code,
                access_token: ''
            }),
          success: function(response) {
            html_code = response;
            if (editor) {
                var insertionPos = {
                    line: 0,
                    ch: 0
                };
                var lastLine = editor.getLastVisibleLine();
                var lastLineLength = editor.document.getLine(lastLine).length;

                var fullRange = {
                    start: insertionPos,
                    end: {
                        line: lastLine,
                        ch: lastLineLength
                    }
                };

                editor.document.replaceRange(html_code, fullRange.start, fullRange.end);
                showNotification('Cleaned out extraneous HTML successfully');
            }
          },
          error: function(xhr, status, error) {
            console.log('POST request failed:', error);
          }
        });
    }
    
    
    // First, register a command - a UI-less object associating an id to a handler
    var MY_COMMAND_ID = "helloworld.writehello";   // package-style naming to avoid collisions
    CommandManager.register("Hello World 33", MY_COMMAND_ID, handleHelloWorld);

    // Then create a menu item bound to the command
    // The label of the menu item is the name we gave the command (see above)
    var menu = Menus.getMenu(Menus.AppMenuBar.FILE_MENU);
    menu.addMenuItem(MY_COMMAND_ID);
});