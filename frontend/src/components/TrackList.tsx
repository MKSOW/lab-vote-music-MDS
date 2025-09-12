import { useEffect, useState } from "react";
import api from "../api/api";

export default function TrackList({ sessionId }: { sessionId: number }) {
  const [tracks, setTracks] = useState<any[]>([]);

  useEffect(() => {
    async function fetchTracks() {
      const res = await api.get(`/tracks/session/${sessionId}`);
      setTracks(res.data);
    }
    fetchTracks();
  }, [sessionId]);

  return (
    <div>
      <h2 className="text-xl font-bold">Morceaux proposés</h2>
      <ul className="mt-4">
        {tracks.map((track) => (
          <li key={track.id} className="flex justify-between border-b py-2">
            <span>
              🎵 {track.title} - {track.artist} ({track._count.votes} votes)
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
