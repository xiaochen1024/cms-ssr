import Router, { withRouter } from 'next/router';

const onClickHandler = href => (event) => {
  event.preventDefault();
  Router.push(href).then(() => window.scrollTo(0, 0));
};

const ActiveLink = ({
  children, router, href, hasDropDown,
}) => {
  const active = router.pathname === href;
  let color = '';
  let hoverColor = '';
  if (hasDropDown) {
    if (active) {
      color = 'rgba(63,75,101, 1)';
      hoverColor = 'rgba(63,75,101, 0.7)';
    } else {
      color = 'rgba(63,75,101, 0.7)';
      hoverColor = 'rgba(63,75,101, 1)';
    }
  } else if (active) {
    color = 'rgba(255,255,255,1)';
    hoverColor = 'rgba(255,255,255,0.7)';
  } else {
    color = 'rgba(255,255,255,0.7)';
    hoverColor = 'rgba(255,255,255,1)';
  }

  return (
    <li
      href="#"
      onClick={onClickHandler(href)}
      style={{ float: 'left', color }}
      role="menuitem"
      aria-selected="false"
      className="headerLink"
    >
      {children}
      <style global jsx>
        {`
					.headerLink:hover {
						color: ${hoverColor}!important;
						cursor: pointer;
					}
				`}
      </style>
    </li>
  );
};
export default withRouter(ActiveLink);
