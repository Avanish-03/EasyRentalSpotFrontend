import React, { useEffect, useState } from "react";
import { getOwnerReviews, getOwnerReviewSummary } from "../../../api/ownerApi";
import { Star } from "lucide-react";

export default function Reviews() {
  const [reviews, setReviews] = useState([]);
  const [summary, setSummary] = useState({
    totalReviews: 0,
    averageRating: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadReviews();
  }, []);

  const loadReviews = async () => {
    try {
      setLoading(true);

      const [sumRes, revRes] = await Promise.all([
        getOwnerReviewSummary(),
        getOwnerReviews(),
      ]);

      /* ---------- SUMMARY ---------- */
      setSummary({
        totalReviews: sumRes.data?.totalReviews ?? 0,
        averageRating: sumRes.data?.averageRating ?? 0,
      });

      /* ---------- REVIEWS ---------- */
      setReviews(
        Array.isArray(revRes.data?.reviews)
          ? revRes.data.reviews
          : []
      );

    } catch (err) {
      console.error("Failed to load reviews", err);
      setReviews([]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <p className="p-10">Loading reviews...</p>;
  }

  return (
    <div className="p-6 space-y-6">

      {/* ================= SUMMARY ================= */}
      <div className="bg-white p-6 rounded-lg shadow-md flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Reviews Summary</h2>
          <p className="text-gray-600">
            {summary.totalReviews} review(s)
          </p>
        </div>

        <div className="flex items-center gap-1 text-yellow-500 text-3xl font-bold">
          <Star size={28} className="fill-yellow-500" />
          {Number(summary.averageRating || 0).toFixed(1)}
        </div>
      </div>

      {/* ================= REVIEW LIST ================= */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-xl font-semibold mb-4">All Reviews</h3>

        {reviews.length === 0 ? (
          <p className="text-gray-500">No reviews yet.</p>
        ) : (
          <div className="space-y-4">
            {reviews.map((rev) => (
              <div
                key={rev._id}
                className="border p-4 rounded-lg flex flex-col md:flex-row justify-between"
              >
                {/* LEFT */}
                <div>
                  <h4 className="font-bold">
                    {rev.tenant?.fullName || "Tenant"}
                  </h4>
                  <p className="text-gray-500 text-sm">
                    {rev.tenant?.email || ""}
                  </p>

                  <div className="flex items-center mt-2">
                    {Array.from({ length: rev.rating || 0 }).map((_, i) => (
                      <Star
                        key={i}
                        size={18}
                        className="text-yellow-500 fill-yellow-500"
                      />
                    ))}
                  </div>
                </div>

                {/* RIGHT */}
                <div className="mt-3 md:mt-0 md:w-2/3">
                  <p className="text-gray-700">{rev.comment}</p>
                  <p className="text-sm text-gray-400 mt-1">
                    {new Date(rev.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
