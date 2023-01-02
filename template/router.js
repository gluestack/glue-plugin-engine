module.exports = () => {
  return [
    {
      "path": "/backend/engine",
      "proxy": {
        "instance": "engine:3500",
        "path": "/v1.0/invoke/engine/method/"
      }
    }
  ];
};
