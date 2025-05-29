import React, { useEffect, useState } from 'react';
import PlaygroundCanvas from '~/comps/PlaygroundCanvas';
import DashboardLayout from '~/lib/Layout';

const Playground = () => {
  
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    setLoading(false);
    return () => {
    }
  }, [])
  return <DashboardLayout>{!loading && <PlaygroundCanvas />}</DashboardLayout>;
};

export default Playground;