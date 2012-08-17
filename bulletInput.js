// bulletInput, a jQuery plugin
// written by Nathan Friend, August of 2012

(function ($)
{
    var methods = {
        init: function (options)
        {
            if (options)
            {
                if (options.maxDepth)
                {
                    this.data("maxDepth", parseInt(options.maxDepth, 10));
                }
                else
                {
                    this.data("maxDepth", 0);
                }

                if (options.maxBullets)
                {
                    this.data("maxBullets", parseInt(options.maxBullets, 10));
                }
                else
                {
                    this.data("maxBullets", 0);
                }

                if (options.initialText)
                {
                    this.data("initialText", options.initialText);
                }
                else
                {
                    this.data("initialText", "");
                }

                if (options.initialTextOnEmpty)
                {
                    this.data("initialTextOnEmpty", true);
                }
                else
                {
                    this.data("initialTextOnEmpty", false);
                }
            }

            window.isCtrl = false;
            window.isShift = false;

            newElement = $("<li><input class='bulletInput-input'/></li>");
            newElementInput = newElement.find(".bulletInput-input").data("container", this).data("level", 1);

            var focusHandler = function(event)
            {
                $(event.target).val("").unbind("focus", focusHandler);
            }

            var initialTextOnEmptyHandler = function (event)
            {
                var container = $(event.target).data("container");
                var elements = container.children("ul").children("li");
                var count = elements.size();

                if (count === 1 && elements.find("input").val() === "")
                {
                    $(event.target).val(container.data("initialText")).bind("focus", focusHandler);
                }
            }

            if (this.data("initialTextOnEmpty"))
            {
                newElementInput.bind("blur", initialTextOnEmptyHandler);
            }

            this.data("newElement", newElement);
            this.addClass("bulletInput-container");
            this.html("<ul></ul>");
            this.children("ul").append(newElement.clone(true));
            this.find(".bulletInput-input").val(this.data("initialText")).bind("focus", focusHandler);


            this.on("keydown", "input", function (event)
            {
                var target = $(event.target);

                // when enter is pushed, make a new bullet at the same level,
                // directly underneath the current bullet
                if (event.keyCode === 13)
                {
                    event.preventDefault();
                    event.stopPropagation();

                    var containerElement = target.data("container");
                    var maxBullets = containerElement.data("maxBullets");
                    var parentElement = target.parent();

                    if (maxBullets !== 0 && containerElement.children("ul").children("li").size() === maxBullets)
                        return;

                    newElement = containerElement.data("newElement").clone(true);

                    while (!(parentElement.is(containerElement)))
                    {
                        //newElement = newElement.wrap("<li class='bulletInput-nobullet'><ul></ul></li>").parent().parent();

                        targetRoot = parentElement;
                        parentElement = parentElement.parent().parent();

                    }

                    var elementToAdd = targetRoot.clone(true);
                    targetRoot.after(elementToAdd);
                    elementToAdd.find(".bulletInput-input").val("").focus();

                    return;
                }

                // if shift+tab is pushed, un-indent only this bullet a single level
                if (event.keyCode === 9 && isShift)
                {
                    event.preventDefault();
                    event.stopPropagation();

                    var container = target.data("container");
                    var level = target.data("level");

                    if (!(target.parent().parent().parent().is(container)))
                    {
                        target.parent().unwrap().unwrap();
                        target.data("level", level - 1);
                        setTimeout(function () { target.focus().val(target.val()); }, 1);
                    }

                    return;
                }

                // if tab is pushed, indent only this bullet a single level
                if (event.keyCode === 9)
                {
                    event.preventDefault();
                    event.stopPropagation();

                    var maxDepth = target.data("container").data("maxDepth");
                    var level = target.data("level");

                    if (maxDepth !== 0)
                    {
                        if (level === maxDepth)
                        {
                            return;
                        }
                    }

                    target.parent().addClass("bulletInput-nobullet");
                    target.wrap("<ul><li></li></ul>");
                    target.data("level", level + 1);
                    setTimeout(function () { target.focus().val(target.val()); }, 1);

                    return;
                }

                // delete the bullet if backspace is pressed and it's empty;
                // focus on the previous bullet
                if (event.keyCode === 8 || event.keyCode === 46)
                {
                    if (target.val() === "")
                    {
                        event.preventDefault();
                        event.stopPropagation();

                        var containerElement = target.data("container");
                        var parentElement = target.parent();

                        while (!(parentElement.is(containerElement)))
                        {
                            var targetRoot = parentElement;
                            parentElement = parentElement.parent().parent();
                        }

                        if (event.keyCode === 8)
                        {
                            var elementToFocus = targetRoot.prev();
                            if (elementToFocus.size() === 0)
                                elementToFocus = targetRoot.next();
                        }
                        else
                        {
                            var elementToFocus = targetRoot.next();
                            if (elementToFocus.size() === 0)
                                elementToFocus = targetRoot.prev();
                        }

                        if (elementToFocus.size() !== 0)
                        {
                            targetRoot.remove();
                            elementToFocus.find(".bulletInput-input").focus().select();
                        }
                        else
                        {
                            targetRoot.find(".bulletInput-input").val("").focus();
                        }
                    }

                    return;
                }

                if (event.keyCode === 38)
                {
                    event.preventDefault();
                    event.stopPropagation();

                    var containerElement = target.data("container");
                    var parentElement = target.parent();

                    while (!(parentElement.is(containerElement)))
                    {
                        var targetRoot = parentElement;
                        parentElement = parentElement.parent().parent();
                    }

                    var elementToFocus = targetRoot.prev()

                    if (elementToFocus.size() !== 0)
                    {
                        inputToFocus = elementToFocus.find(".bulletInput-input");
                        inputToFocus.focus().val(inputToFocus.val());
                    }

                    return;
                }

                if (event.keyCode === 40)
                {
                    event.preventDefault();
                    event.stopPropagation();

                    var containerElement = target.data("container");
                    var parentElement = target.parent();

                    while (!(parentElement.is(containerElement)))
                    {
                        var targetRoot = parentElement;
                        parentElement = parentElement.parent().parent();
                    }

                    var elementToFocus = targetRoot.next()

                    if (elementToFocus.size() !== 0)
                    {
                        inputToFocus = elementToFocus.find(".bulletInput-input");
                        inputToFocus.focus().val(inputToFocus.val());
                    }

                    return;
                }

            });

            $(document).on("keydown", function (event)
            {
                if (event.keyCode === 16)
                    isShift = true;
                else if (event.keyCode === 17)
                    isCtrl = true;
            }).on("keyup", function (event)
            {
                if (event.keyCode === 16)
                    isShift = false;
                else if (event.keyCode === 17)
                    isCtrl = false;
            });
        }
    };

    $.fn.bulletInput = function (method)
    {
        if (methods[method])
        {
            return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
        } else if (typeof method === 'object' || !method)
        {
            return methods.init.apply(this, arguments);
        } else
        {
            $.error('Method ' + method + ' does not exist on jQuery.bulletInput');
        }

    };
})(jQuery);