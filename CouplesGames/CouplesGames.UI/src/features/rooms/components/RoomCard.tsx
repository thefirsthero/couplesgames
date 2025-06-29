import React from 'react';

type Props = {
  roomId: string;
};

const RoomCard: React.FC<Props> = ({ roomId }) => (
  <div>
    <h2>Room {roomId}</h2>
  </div>
);

export default RoomCard;
