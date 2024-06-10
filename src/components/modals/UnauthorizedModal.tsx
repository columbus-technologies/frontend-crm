import React from "react";
import { Modal, Button } from "antd";
import { useNavigate } from "react-router-dom";

interface UnauthorizedModalProps {
  visible: boolean;
  onClose: () => void;
}

const UnauthorizedModal: React.FC<UnauthorizedModalProps> = ({
  visible,
  onClose,
}) => {
  const navigate = useNavigate();

  const handleOk = () => {
    onClose();
    navigate("/login");
  };

  return (
    <Modal
      title="Credentials Expired"
      visible={visible}
      maskClosable={false}
      footer={[
        <Button key="ok" type="primary" onClick={handleOk}>
          OK
        </Button>,
      ]}
    >
      <p>Credentials Expired. Please login again.</p>
    </Modal>
  );
};

export default UnauthorizedModal;
