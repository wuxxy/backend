import React from 'react';
import type { PlaygroundObject } from '~/lib/playgroundStore';
import { MethodFormCard } from './PlaygroundCards';

const PlaygroundComponent = ({obj}:{obj:PlaygroundObject}) => {
  switch (obj.type) {
    case "request":
      return <MethodFormCard />;
  } 
};

export default PlaygroundComponent;