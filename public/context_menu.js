var menu = document.querySelector('.menu');
let flag = false;

function showMenu(x, y){
	menu.style.left = x + 'px';
	menu.style.top = y + 'px';
	menu.classList.add('show-menu');
}

function hideMenu(){
	menu.classList.remove('show-menu');
}

$(function () {
    let elementid = $('#field');
    elementid.mouseover(function () {
        flag = true;
    });
});

$(function () {
    let elementid = $('#field');
    elementid.mouseout(function () {
        flag = false;
    });
});

function onContextMenu(e){
	if (flag){
		e.preventDefault();
		showMenu(e.pageX, e.pageY);
		document.addEventListener('mouseup', onMouseUp, false);
	}
}

function onMouseUp(e){
	hideMenu();
	document.removeEventListener('mouseup', onMouseUp);
}

document.addEventListener('contextmenu', onContextMenu, false);
