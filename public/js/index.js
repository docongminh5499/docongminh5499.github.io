function openSidebar() {
  document.querySelector('.sidebar').classList.add('sidebar--active');
  document.querySelector('.overlay').classList.add('overlay--active');
}

function closeSidebar() {
  document.querySelector('.sidebar').classList.remove('sidebar--active');
  document.querySelector('.overlay').classList.remove('overlay--active');
}

function fixNavbar() {
  const navbar = document.querySelector('.header__navbar-container');
  if (window.pageYOffset > navbar.offsetTop) navbar.classList.add('header__navbar--fixed');
  else navbar.classList.remove('header__navbar--fixed');
}

function scrollToTop(e) {
  window.scrollTo({ top: 50, behavior: 'smooth' });
  e.preventDefault();
}

function styleBar() {
  document
    .querySelectorAll('.skill__container .skill__bar--fill')
    .forEach(element => (element.style.width = element.getAttribute('value') || '0%'));
}

function styleNavTimeline(maxPosition, newPos) {
  const left = document.querySelector('.work__container .event__navigation.event__navigation--left');
  const right = document.querySelector('.work__container .event__navigation.event__navigation--right');
  left.classList.remove('disabled');
  right.classList.remove('disabled');
  newPos == 0 && left.classList.add('disabled');
  newPos == maxPosition && right.classList.add('disabled');
}

function onClickTimeline(e, timelineInfo, timelinePosition, timeline) {
  const newPos = Number(e.target.getAttribute('position', 0)) || 0;
  eventTimelineChange(newPos, timelineInfo, timelinePosition, timeline);
}

function eventTimelineChange(newPos, timelineInfo, timelinePosition, timeline) {
  // Dont change, do nothing
  if (newPos == timelinePosition.current) return;

  // Else
  const maxPos = Math.max(newPos, timelinePosition.current);
  const minPos = Math.min(newPos, timelinePosition.current);
  const className = newPos > timelinePosition.current ? 'to__left' : 'to__right';

  for (let index = minPos + 1; index < maxPos; index++) {
    timelineInfo[index].classList.toggle('to__left');
    timelineInfo[index].classList.toggle('to__right');
  }

  timelineInfo[newPos].classList.add('selected');
  timelineInfo[newPos].classList.remove('to__left', 'to__right');
  timelineInfo[timelinePosition.current].classList.add(className);
  timelineInfo[timelinePosition.current].classList.remove('selected');

  // Style timeline node
  for (let index = minPos + 2; index < maxPos + 2; index++) timeline.childNodes[index].classList.toggle('active');
  timeline.childNodes[newPos + 1].classList.add('selected');
  timeline.childNodes[timelinePosition.current + 1].classList.remove('selected');
  timelinePosition.current = newPos;

  // Navigation styles
  styleNavTimeline(timelinePosition.maxPosition, newPos);
  // style timeline
  timeline.style.marginLeft = -320 * newPos + 'px';
}

function timeline() {
  const timeline = document.querySelector('.work__container .timeline__wrapper .timeline');
  const timelineInfo = document.querySelectorAll('.work__container > .work__content > .events_info > div');
  const timelinePosition = {
    current: 0,
    maxPosition: timelineInfo.length - 1
  };

  timelineInfo.forEach((e, id) => {
    /* Create div element containt anchor and span */
    const div = document.createElement('div');
    /* Set active style for first element */
    if (id == 0) {
      e.classList.add('selected');
      div.classList.add('active', 'selected');
    } else e.classList.add('to__right');
    // Add addition infomation
    div.setAttribute('position', id);
    div.onclick = e => onClickTimeline(e, timelineInfo, timelinePosition, timeline);
    const anchor = document.createElement('p');
    anchor.setAttribute('position', id);
    anchor.innerHTML = e.getAttribute('date', '');
    div.appendChild(anchor);
    /* Append div to timeline and set position for this event */
    timeline.appendChild(div);
    e.setAttribute('position', id);
  });
  /* left and right button click */
  const left = document.querySelector('.work__container .event__navigation--left');
  const right = document.querySelector('.work__container .event__navigation--right');
  timelinePosition.current == 0 && left.classList.add('disabled');
  timelinePosition.current == timelinePosition.maxPosition && right.classList.add('disabled');
  left.onclick = () => eventTimelineChange(timelinePosition.current - 1, timelineInfo, timelinePosition, timeline);
  right.onclick = () => eventTimelineChange(timelinePosition.current + 1, timelineInfo, timelinePosition, timeline);
  /* Load complete */
  timeline.parentNode.parentNode.classList.add('work__content--loaded');
}

window.onload = () => {
  timeline();
  fixNavbar();
  styleBar();
  window.onscroll = fixNavbar;
  document.querySelector('.navbar__icon').onclick = openSidebar;
  document.querySelector('.overlay').onclick = closeSidebar;
  document.querySelectorAll('.sidebar a').forEach((anchor, id) => {
    if (id === 0)
      anchor.onclick = e => {
        closeSidebar();
        scrollToTop(e);
      };
    else anchor.onclick = closeSidebar;
  });
  document.querySelectorAll('.header__container .header__navbar > div a')[0].onclick = scrollToTop;
  document.querySelector('.sidebar svg').onclick = closeSidebar;
};
