import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";
import ServiceCard from "../components/services/ServiceCard";
import DoubtThread from "../components/doubts/DoubtThread";
import Modal from "../components/common/Modal";
import AddServiceForm from "../components/services/AddServiceForm";
import AddDoubtForm from "../components/doubts/AddDoubtForm";
import IncomingRequests from "../components/services/IncomingRequests";

export default function StudentDashboard() {
  const { user } = useAuth();
  const [services, setServices] = useState([]);
  const [doubts, setDoubts] = useState([]);
  const [incomingRequests, setIncomingRequests] = useState([]);
  const [isServiceModalOpen, setIsServiceModalOpen] = useState(false);
  const [isDoubtModalOpen, setIsDoubtModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [servicesRes, doubtsRes, requestsRes] = await Promise.all([
        api.get("/services"),
        api.get("/doubts"),
        api.get("/services/requests/incoming"),
      ]);

      setServices(servicesRes.data);
      setDoubts(doubtsRes.data);
      setIncomingRequests(requestsRes.data);
    } catch (error) {
      console.error("Failed to fetch dashboard data:", error);
      alert(
        "Failed to load dashboard data. Please check the console for details."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

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
        isOpen={isServiceModalOpen}
        onClose={() => setIsServiceModalOpen(false)}
        title="Offer a New Service"
      >
        <AddServiceForm
          onClose={() => setIsServiceModalOpen(false)}
          onServiceAdded={fetchData}
        />
      </Modal>

      <Modal
        isOpen={isDoubtModalOpen}
        onClose={() => setIsDoubtModalOpen(false)}
        title="Ask a New Doubt"
      >
        <AddDoubtForm
          onClose={() => setIsDoubtModalOpen(false)}
          onDoubtAdded={fetchData}
        />
      </Modal>

      <div className="min-h-screen w-full bg-black text-white">
        <header className="border-b border-zinc-800 bg-zinc-950 p-4">
          <h1 className="text-2xl font-bold">Student Dashboard</h1>
          <p className="text-zinc-400">Welcome back, {user?.name}!</p>
        </header>

        <main className="grid grid-cols-1 gap-8 p-4 md:grid-cols-2 lg:p-8">
          <section>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-semibold">Available Services</h2>
              <button
                onClick={() => setIsServiceModalOpen(true)}
                className="rounded-md bg-white px-3 py-1.5 text-sm font-semibold text-black transition-colors hover:bg-zinc-200"
              >
                + Offer Service
              </button>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
              {services.map((service) => {
                const isMyService = service.providerId === user.student_id;
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
          </section>

          <section className="space-y-8">
            <div>
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-xl font-semibold">Your Doubts</h2>
                <button
                  onClick={() => setIsDoubtModalOpen(true)}
                  className="rounded-md bg-white px-3 py-1.5 text-sm font-semibold text-black transition-colors hover:bg-zinc-200"
                >
                  + Ask Doubt
                </button>
              </div>
              <div className="space-y-4">
                {doubts.length > 0 ? (
                  doubts.map((doubt) => (
                    <DoubtThread
                      key={doubt.doubt_id}
                      doubt={doubt}
                      userRole="student"
                    />
                  ))
                ) : (
                  <p className="text-sm text-zinc-400">
                    You haven't submitted any doubts yet.
                  </p>
                )}
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
