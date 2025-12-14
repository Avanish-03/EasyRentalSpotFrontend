import React, { useEffect, useState } from "react";
import { getOwnerReviews, getOwnerReviewSummary } from "../../../api/ownerApi";
import { Star } from "lucide-react";

export default function Reviews() {
  const [reviews, setReviews] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadReviews();
  }, []);

  const loadReviews = async () => {
    try {
      const [sum, rev] = await Promise.all([
        getOwnerReviewSummary(),
        getOwnerReviews(),
      ]);

      setSummary(sum.data);
      setReviews(rev.data);
    } catch (err) {
      console.error(err);
      alert("Failed to load reviews");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p className="p-10">Loading reviews...</p>;

  return (
    <div className="p-6 space-y-6">
      {/* Summary */}
      <div className="bg-white p-6 rounded-lg shadow-md flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Reviews Summary</h2>
          <p className="text-gray-600">{summary.totalReviews} review(s)</p>
        </div>

        <div className="flex items-center gap-1 text-yellow-500 text-3xl font-bold">
          <Star size={28} className="text-yellow-500" />
          {summary.averageRating.toFixed(1)}
        </div>
      </div>

      {/* Review List */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-xl font-semibold mb-4">All Reviews</h3>

        {reviews.length === 0 ? (
          <p>No reviews yet.</p>
        ) : (
          <div className="space-y-4">
            {reviews.map((rev) => (
              <div
                key={rev._id}
                className="border p-4 rounded-lg flex flex-col md:flex-row justify-between"
              >
                {/* Left: reviewer + rating */}
                <div>
                  <h4 className="font-bold">{rev.tenant?.fullName}</h4>
                  <p className="text-gray-500 text-sm">{rev.tenant?.email}</p>

                  {/* Rating */}
                  <div className="flex items-center mt-2">
                    {Array.from({ length: rev.rating }).map((_, i) => (
                      <Star
                        key={i}
                        size={18}
                        className="text-yellow-500 fill-yellow-500"
                      />
                    ))}
                  </div>
                </div>

                {/* Right: Review Message */}
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
