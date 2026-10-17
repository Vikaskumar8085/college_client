import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchRecords,
  createRecord,
  updateRecord,
  deleteRecord,
} from "../features/records/recordSlice";
import { logout } from "../features/auth/authSlice";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import "./Dashboard.css";

const emptyValues = { title: "", description: "" };

const Dashboard = () => {
  const dispatch = useDispatch();
  const { records, isLoading } = useSelector((state) => state.records);
  const [editId, setEditId] = useState(null);
  const [deletingId, setDeletingId] = useState(null); // Track which record is being deleted
  const [initialValues, setInitialValues] = useState(emptyValues);

  useEffect(() => {
    dispatch(fetchRecords());
  }, [dispatch]);

  const validationSchema = Yup.object({
    title: Yup.string().required("Title is required"),
    description: Yup.string().required("Description is required"),
  });

  const handleClearForm = (resetForm) => {
    setEditId(null);
    setInitialValues(emptyValues);
    resetForm({ values: emptyValues });
  };

  const handleDeleteRecord = async (id) => {
    setDeletingId(id);
    await dispatch(deleteRecord(id));
    setDeletingId(null);

    // If deleting the record currently being edited, reset the form
    if (editId === id) {
      setEditId(null);
      setInitialValues(emptyValues);
    }
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-card">
        {/* Header Section */}
        <div className="dashboard-header">
          <h2 className="dashboard-title">Secure Dashboard</h2>
          <button onClick={() => dispatch(logout())} className="logout-btn">
            Logout
          </button>
        </div>

        {/* Formik Form for Create / Update */}
        <Formik
          enableReinitialize
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={async (values, { resetForm }) => {
            if (editId) {
              await dispatch(updateRecord({ id: editId, recordData: values }));
            } else {
              await dispatch(createRecord(values));
            }
            handleClearForm(resetForm);
          }}
        >
          {({ isSubmitting, resetForm }) => (
            <Form className="record-form">
              <h3 className="form-heading">
                {editId ? "Edit Record" : "Add New Record"}
              </h3>

              <div className="form-group">
                <label className="form-label" htmlFor="title">
                  Title
                </label>
                <Field
                  id="title"
                  type="text"
                  name="title"
                  placeholder="Record Title"
                  className="form-input"
                  disabled={isSubmitting}
                />
                <ErrorMessage
                  name="title"
                  component="div"
                  className="error-message"
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="description">
                  Description
                </label>
                <Field
                  id="description"
                  as="textarea"
                  name="description"
                  placeholder="Record Description"
                  className="form-input textarea-input"
                  disabled={isSubmitting}
                />
                <ErrorMessage
                  name="description"
                  component="div"
                  className="error-message"
                />
              </div>

              <div className="form-actions">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`submit-btn ${editId ? "update-mode" : ""}`}
                >
                  {isSubmitting ? (
                    <>
                      <span className="spinner"></span>
                      {editId ? "Updating..." : "Adding..."}
                    </>
                  ) : editId ? (
                    "Update Record"
                  ) : (
                    "Add Record"
                  )}
                </button>

                {editId && (
                  <button
                    type="button"
                    disabled={isSubmitting}
                    onClick={() => handleClearForm(resetForm)}
                    className="cancel-btn"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </Form>
          )}
        </Formik>

        {/* Records List Section */}
        <div className="records-section">
          <h3 className="records-heading">Your Records Repository</h3>

          {isLoading ? (
            <div className="list-loader-container">
              <span className="large-spinner"></span>
              <p>Loading records...</p>
            </div>
          ) : records.length === 0 ? (
            <p className="empty-state">
              No records found. Create your first entry above.
            </p>
          ) : (
            <div className="records-list">
              {records.map((record) => {
                const isDeleting = deletingId === record._id;

                return (
                  <div key={record._id} className="record-item">
                    <div className="record-content">
                      <h4 className="record-item-title">{record.title}</h4>
                      <p className="record-item-desc">{record.description}</p>
                    </div>
                    <div className="record-actions">
                      <button
                        onClick={() => {
                          setEditId(record._id);
                          setInitialValues({
                            title: record.title,
                            description: record.description,
                          });
                        }}
                        disabled={isDeleting}
                        className="edit-btn"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteRecord(record._id)}
                        disabled={isDeleting}
                        className="delete-btn"
                      >
                        {isDeleting ? (
                          <>
                            <span className="spinner"></span>
                            Deleting...
                          </>
                        ) : (
                          "Delete"
                        )}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
