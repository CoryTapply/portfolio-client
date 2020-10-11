import React from "react";
import PropTypes from "prop-types";
import cx from "classnames";
import Style from "./Modal.scss";

const Modal = props => {
  const handleCloseModal = e => {
    e.preventDefault();
    props.onCloseModal(e);
  };

  return (
    <>
      <div className={cx("Modal", { isOpen: props.isOpen })}>
        <div className="Modal-Content">
          <span className="Modal-Close" onClick={handleCloseModal}>
            X
          </span>
          {props.children}
        </div>
      </div>
      <div
        className={cx("Modal-Veil", { isOpen: props.isOpen })}
        onClick={handleCloseModal}
      />
    </>
  );
};

Modal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onCloseModal: PropTypes.func
};

Modal.defaultProps = {
  onCloseModal() {}
};

export default Modal;
