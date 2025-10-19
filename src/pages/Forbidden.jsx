import React from "react";
import { useNavigate, Link } from "react-router-dom";



const Forbidden = () => {
  const navigate = useNavigate();

  return (
    <div className="container d-flex flex-column align-items-center justify-content-center" style={{ minHeight: "70vh", textAlign: "center" }}>
      <div className="mb-3">
        <i className="bi bi-shield-lock text-danger" style={{ fontSize: 72 }} />
      </div>
      <h1 className="display-5 fw-bold">403 - Forbidden</h1>
      <p className="text-muted mb-4">Bạn không có quyền truy cập vào trang này.</p>
      <div className="d-flex gap-3">
        <button className="btn btn-primary" onClick={() => navigate(-1)}>Quay lại</button>
        <Link className="btn btn-outline-secondary" to="/home">Về trang chủ</Link>
      </div>
    </div>
  );
};

export default Forbidden;


