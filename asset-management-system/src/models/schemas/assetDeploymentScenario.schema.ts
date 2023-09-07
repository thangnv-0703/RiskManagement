import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class AssetDeploymentScenario extends Document {
  @Prop({ default: null })
  assetId: string;

  @Prop({ default: null })
  deploymentScenarioId: string;

  @Prop({ default: null })
  deploymentScenarioName: string;
}

export const AssetDeploymentScenarioSchema = SchemaFactory.createForClass(
  AssetDeploymentScenario,
);
