import { Component } from 'react';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListSubheader from '@material-ui/core/ListSubheader';
import PropTypes from 'prop-types';

/**
 */
export class WindowList extends Component {
  /**
   * Get the title for a window from its manifest title
   * @private
   */
  titleContent(windowId) {
    const { titles, t } = this.props;

    return titles[windowId] || t('untitled');
  }

  /**
   * render
   * @return
   */
  render() {
    const {
      container, handleClose, windowIds, focusWindow, focusedWindowId, t,
      ...menuProps
    } = this.props;

    return (
      <Menu
        anchorOrigin={{
          horizontal: 'right',
          vertical: 'top',
        }}
        transformOrigin={{
          horizontal: 'left',
          vertical: 'top',
        }}
        id="window-list-menu"
        container={container?.current}
        onClose={handleClose}
        {...menuProps}
      >
        <ListSubheader role="presentation" selected={false} disabled tabIndex="-1">
          {t('openWindows')}
        </ListSubheader>
        {
          windowIds.map((windowId, i) => (
            <MenuItem
              key={windowId}
              selected={windowId === focusedWindowId}
              onClick={(e) => { focusWindow(windowId, true); handleClose(e); }}
            >
              <ListItemText primaryTypographyProps={{ variant: 'body1' }}>
                {
                  this.titleContent(windowId)
                }
              </ListItemText>
            </MenuItem>
          ))
        }
      </Menu>
    );
  }
}

WindowList.propTypes = {
  container: PropTypes.shape({ current: PropTypes.instanceOf(Element) }),
  focusedWindowId: PropTypes.string,
  focusWindow: PropTypes.func.isRequired,
  handleClose: PropTypes.func.isRequired,
  t: PropTypes.func,
  titles: PropTypes.objectOf(PropTypes.string),
  windowIds: PropTypes.arrayOf(PropTypes.string).isRequired,
};

WindowList.defaultProps = {
  container: null,
  focusedWindowId: null,
  t: key => key,
  titles: {},
};
