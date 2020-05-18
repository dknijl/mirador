import React, { Component } from 'react';
import PropTypes from 'prop-types';
import 'intersection-observer'; // polyfill needed for Safari
import Typography from '@material-ui/core/Typography';
import IntersectionObserver from '@researchgate/react-intersection-observer';

/**
 * Uses InteractionObserver to "lazy" load canvas thumbnails that are in view.
 */
export class CanvasThumbnail extends Component {
  /**
   */
  constructor(props) {
    super(props);
    this.state = { loaded: false };
    this.handleIntersection = this.handleIntersection.bind(this);
  }

  /**
   *
  */
  imageStyles() {
    const {
      maxHeight, maxWidth, style, image,
    } = this.props;

    let height = 'auto';
    let width = 'auto';

    const { height: thumbHeight, width: thumbWidth } = image;

    if (thumbHeight && thumbWidth) {
      if ((maxHeight && (thumbHeight > maxHeight)) || (maxWidth && (thumbWidth > maxWidth))) {
        const aspectRatio = thumbWidth / thumbHeight;

        if (maxHeight && maxWidth) {
          if ((maxWidth / maxHeight) < aspectRatio) {
            height = Math.round(maxWidth / aspectRatio);
            width = maxWidth;
          } else {
            height = maxHeight;
            width = Math.round(maxHeight * aspectRatio);
          }
        } else if (maxHeight) {
          height = maxHeight;
          width = Math.round(maxHeight * aspectRatio);
        } else if (maxWidth) {
          height = Math.round(maxWidth / aspectRatio);
          width = maxWidth;
        }
      } else {
        width = thumbWidth;
        height = thumbHeight;
      }
    } else if (thumbHeight && !thumbWidth) {
      height = maxHeight;
    } else if (!thumbHeight && thumbWidth) {
      width = maxWidth;
    }

    return {
      height,
      width,
      ...style,
    };
  }

  /**
   * Handles the intersection (visibility) of a given thumbnail, by requesting
   * the image and then updating the state.
   */
  handleIntersection(event) {
    const { loaded } = this.state;

    if (loaded || !event.isIntersecting) return;

    this.setState({
      loaded: true,
    });
  }

  /**
   */
  render() {
    const {
      children,
      classes,
      image,
      label,
      labelled,
    } = this.props;

    const { loaded } = this.state;

    return (
      <div className={classes.root}>
        <IntersectionObserver onChange={this.handleIntersection}>
          <img
            alt=""
            role="presentation"
            src={(loaded && image.url) || CanvasThumbnail.defaultImgPlaceholder}
            style={this.imageStyles()}
            className={classes.image}
          />
        </IntersectionObserver>
        { labelled && label && (
          <div className={classes.label}>
            <Typography variant="caption" classes={{ root: classes.caption }}>
              {label}
            </Typography>
          </div>
        )}
        {children}
      </div>
    );
  }
}

// Transparent "gray"
CanvasThumbnail.defaultImgPlaceholder = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mMMDQmtBwADgwF/Op8FmAAAAABJRU5ErkJggg==';

CanvasThumbnail.propTypes = {
  children: PropTypes.node,
  classes: PropTypes.objectOf(PropTypes.string),
  image: PropTypes.shape({
    height: PropTypes.number,
    url: PropTypes.string.isRequired,
    width: PropTypes.number,
  }).isRequired,
  label: PropTypes.string,
  labelled: PropTypes.bool,
  maxHeight: PropTypes.number,
  maxWidth: PropTypes.number,
  style: PropTypes.object, // eslint-disable-line react/forbid-prop-types
};

CanvasThumbnail.defaultProps = {
  children: null,
  classes: {},
  label: undefined,
  labelled: false,
  maxHeight: null,
  maxWidth: null,
  style: {},
};
