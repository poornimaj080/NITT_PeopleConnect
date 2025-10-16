import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";
import DoubtThread from "../components/doubts/DoubtThread";
import ServiceCard from "../components/services/ServiceCard";
import Modal from "../components/common/Modal";
import AddServiceForm from "../components/services/AddServiceForm";
import IncomingRequests from "../components/services/IncomingRequests";

export default function FacultyDashboard() {
  const { user } = useAuth();
  const [doubts, setDoubts] = useState([]);
  const [services, setServices] = useState([]);
  const [incomingRequests, setIncomingRequests] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [doubtsRes, servicesRes, requestsRes] = await Promise.all([
        api.get("/doubts"),
        api.get("/services"),
        api.get("/services/requests/incoming"),
      ]);

      // No more sorting needed here!
      setDoubts(doubtsRes.data);
      setServices(servicesRes.data);
      setIncomingRequests(requestsRes.data);
    } catch (error) {
      console.error("Failed to fetch dashboard data:", error);
      alert("Failed to load dashboard data. Please check the console.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAnswerDoubt = async (doubtId, answer) => {
    try {
      await api.put(`/doubts/${doubtId}/answer`, { answer });
      alert("Answer submitted successfully!");
      fetchData(); // Refresh all data
    } catch (error) {
      alert("Failed to submit answer.");
    }
  };

  const handleRequestService = async (serviceId) => {
    try {
      await api.post(`/services/${serviceId}/request`);
      alert("Service requested successfully!");
    } catch (error) {
      alert("Failed to request service.");
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-black text-white">
        Loading dashboard...
      </div>
    );
  }

  return (
    <>
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Offer a New Service"
      >
        <AddServiceForm
          onClose={() => setIsModalOpen(false)}
          onServiceAdded={fetchData}
        />
      </Modal>

      <div className="min-h-screen w-full bg-black text-white">
        <header className="border-b border-zinc-800 bg-zinc-950 p-4">
          <h1 className="text-2xl font-bold">Faculty Dashboard</h1>
          <p className="text-zinc-400">Welcome back, {user?.name}!</p>
        </header>

        <main className="grid grid-cols-1 gap-8 p-4 md:grid-cols-2 lg:p-8">
          <section>
            <h2 className="mb-4 text-xl font-semibold">Student Doubts</h2>
            <div className="space-y-4">
              {doubts.length > 0 ? (
                doubts.map((doubt) => (
                  <DoubtThread
                    key={doubt.doubt_id}
                    doubt={doubt}
                    onAnswer={handleAnswerDoubt}
                    userRole="faculty"
                  />
                ))
              ) : (
                <p className="text-sm text-zinc-400">
                  There are no open doubts assigned to you.
                </p>
              )}
            </div>
          </section>

          <section className="space-y-8">
            <div>
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-xl font-semibold">Available Services</h2>
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="rounded-md bg-white px-3 py-1.5 text-sm font-semibold text-black transition-colors hover:bg-zinc-200"
                >
                  + Offer Service
                </button>
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
                {services.map((service) => {
                  const isMyService = service.providerId === user.faculty_id;
                  return (
                    <ServiceCard
                      key={`${service.service_id}-${service.providerId}`}
                      service={service}
                      onAction={!isMyService ? handleRequestService : null}
                      actionLabel="Request Service"
                    />
                  );
                })}
              </div>
            </div>

            <div>
              <h2 className="mb-4 text-xl font-semibold">
                Incoming Service Requests
              </h2>
              <IncomingRequests requests={incomingRequests} />
            </div>
          </section>
        </main>
      </div>
    </>
  );
}
