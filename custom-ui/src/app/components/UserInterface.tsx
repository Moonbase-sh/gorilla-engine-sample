import * as React from 'react';
import { LabeledKnob, LabeledSlider } from '@gorilla-engine-sdk/ge-labeled-components';

const FONT_M = 'fonts/Roboto-Medium.otf';
const FONT_B = 'fonts/Roboto-Bold.otf';
const FONT_R = 'fonts/Roboto-Regular.otf';

const KNOB_PROPS = {
  width: 85,
  height: 85,
  backgroundColor: '00FFFFFF',
  hideValueLabel: true,
  hideTextValue: true,
  toggleVisibilityOnHover: true,
  valueLabel: { y: 71, height: 14, font: FONT_M, fontSize: 14, textAlign: 'center' as const },
  knob: {
    filmstrip: { path: 'images/Rotary.png', count: 128, direction: 'vertical' as const },
  },
};

const BIPOLAR_KNOB = {
  filmstrip: {
    path: 'images/Rotary Bipolar.png',
    count: 128,
    direction: 'vertical' as const,
  },
};

const knobLabel = (text: string) => ({ ...KNOB_PROPS.valueLabel, text });

const SLIDER_PROPS = {
  width: 160,
  height: 40,
  backgroundColor: '00FFFFFF',
  hideValueLabel: true,
  hideTextValue: true,
  toggleVisibilityOnHover: true,
  valueLabel: { y: 0, height: 16, font: FONT_M, fontSize: 13, textAlign: 'center' as const },
  slider: {
    width: 140,
    height: 18,
    y: 20,
    direction: 'horizontal' as const,
    filmstrip: {
      path: 'images/Horizontal Slider.png',
      count: 128,
      direction: 'vertical' as const,
    },
  },
};

const sliderLabel = (text: string) => ({ ...SLIDER_PROPS.valueLabel, text });

type Props = {
  instrument: GorillaEngine.Runtime.Instrument;
};

export function UserInterface({ instrument }: Props) {
  return (
    <>
      {/* ── Header: centred in the space to the right of the preset browser ── */}
      <geLabel
        x={397}
        y={25}
        width={484}
        height={14}
        text={GorillaEngine.getManufacturerName()}
        textColor="5177E0"
        font={FONT_M}
        fontSize={12}
        textAlign="center"
      />
      <geLabel
        x={397}
        y={40}
        width={484}
        height={28}
        text={GorillaEngine.getPluginName()}
        textColor="E1E6F5"
        font={FONT_B}
        fontSize={24}
        textAlign="center"
      />

      {/* ── Section labels ──────────────────────────────────────────── */}
      <geLabel
        x={40}
        y={100}
        width={200}
        height={14}
        text="AMP"
        textColor="5177E0"
        font={FONT_M}
        fontSize={13}
      />
      <geLabel
        x={439}
        y={100}
        width={200}
        height={14}
        text="FILTER"
        textColor="5177E0"
        font={FONT_M}
        fontSize={13}
      />

      {/* ── AMP — row 1: Attack, Decay, Sustain ─────────────────────── */}
      <LabeledKnob
        {...KNOB_PROPS}
        x={60}
        y={118}
        instrument={instrument}
        instrumentProp={instrument.amp_attack}
        textLabel={knobLabel('ATTACK')}
      />
      <LabeledKnob
        {...KNOB_PROPS}
        x={160}
        y={118}
        instrument={instrument}
        instrumentProp={instrument.amp_decay}
        textLabel={knobLabel('DECAY')}
      />
      <LabeledKnob
        {...KNOB_PROPS}
        x={260}
        y={118}
        instrument={instrument}
        instrumentProp={instrument.amp_sustain}
        textLabel={knobLabel('SUSTAIN')}
      />

      {/* ── AMP — row 2: Release, Velocity ──────────────────────────── */}
      <LabeledKnob
        {...KNOB_PROPS}
        x={120}
        y={228}
        instrument={instrument}
        instrumentProp={instrument.amp_release}
        textLabel={knobLabel('RELEASE')}
      />
      <LabeledKnob
        {...KNOB_PROPS}
        x={220}
        y={228}
        instrument={instrument}
        instrumentProp={instrument.amp_velocity}
        textLabel={knobLabel('VELOCITY')}
      />

      {/* ── FILTER — row 1: ADSR ────────────────────────────────────── */}
      <LabeledKnob
        {...KNOB_PROPS}
        x={469}
        y={118}
        instrument={instrument}
        instrumentProp={instrument.filter_attack}
        textLabel={knobLabel('ATTACK')}
      />
      <LabeledKnob
        {...KNOB_PROPS}
        x={569}
        y={118}
        instrument={instrument}
        instrumentProp={instrument.filter_decay}
        textLabel={knobLabel('DECAY')}
      />
      <LabeledKnob
        {...KNOB_PROPS}
        x={669}
        y={118}
        instrument={instrument}
        instrumentProp={instrument.filter_sustain}
        textLabel={knobLabel('SUSTAIN')}
      />
      <LabeledKnob
        {...KNOB_PROPS}
        x={769}
        y={118}
        instrument={instrument}
        instrumentProp={instrument.filter_release}
        textLabel={knobLabel('RELEASE')}
      />

      {/* ── FILTER — row 2: Cutoff, Reso, Env ───────────────────────── */}
      <LabeledKnob
        {...KNOB_PROPS}
        x={524}
        y={228}
        instrument={instrument}
        instrumentProp={instrument.filter_cutoff}
        textLabel={knobLabel('CUTOFF')}
      />
      <LabeledKnob
        {...KNOB_PROPS}
        x={624}
        y={228}
        instrument={instrument}
        instrumentProp={instrument.filter_reso}
        textLabel={knobLabel('RESO')}
      />
      <LabeledKnob
        {...KNOB_PROPS}
        x={724}
        y={228}
        instrument={instrument}
        instrumentProp={instrument.filter_env}
        textLabel={knobLabel('ENV')}
        knob={BIPOLAR_KNOB}
      />

      {/* ── Divider ─────────────────────────────────────────────────── */}
      <geLabel x={0} y={380} width={920} height={1} backgroundColor="3F4354" />

      {/* ── Lower: Mode ─────────────────────────────────────────────── */}
      <geLabel
        x={40}
        y={390}
        width={96}
        height={14}
        text="MODE"
        textColor="E1E6F5"
        font={FONT_M}
        fontSize={13}
        textAlign="center"
      />
      <geComboBox
        x={40}
        y={408}
        width={96}
        height={24}
        backgroundColor="1d2029"
        textColor="E1E6F5"
        font={FONT_R}
        fontSize={13}
        bindings={{ value: instrument.mode, items: instrument.mode }}
      />

      {/* ── Lower: Octave ───────────────────────────────────────────── */}
      <geLabel
        x={174}
        y={390}
        width={96}
        height={14}
        text="OCTAVE"
        textColor="E1E6F5"
        font={FONT_M}
        fontSize={13}
        textAlign="center"
      />
      <geComboBox
        x={174}
        y={408}
        width={96}
        height={24}
        backgroundColor="1d2029"
        textColor="E1E6F5"
        font={FONT_R}
        fontSize={13}
        bindings={{ value: instrument.octave, items: instrument.octave }}
      />

      {/* ── Lower: LFO Rate ─────────────────────────────────────────── */}
      <LabeledSlider
        {...SLIDER_PROPS}
        x={308}
        y={390}
        instrument={instrument}
        instrumentProp={instrument.lfo_rate}
        textLabel={sliderLabel('LFO RATE')}
      />

      {/* ── Lower: Glide Time ───────────────────────────────────────── */}
      <LabeledSlider
        {...SLIDER_PROPS}
        x={506}
        y={390}
        instrument={instrument}
        instrumentProp={instrument.glide_time}
        textLabel={sliderLabel('GLIDE')}
      />

      {/* ── Lower: Chorus toggle ────────────────────────────────────── */}
      <geLabel
        x={704}
        y={390}
        width={80}
        height={14}
        text="CHORUS"
        textColor="E1E6F5"
        font={FONT_M}
        fontSize={13}
        textAlign="center"
      />
      <geToggle
        x={725}
        y={408}
        width={38}
        height={20}
        onImage="images/toggle-pressed.png"
        offImage="images/toggle-default.png"
        bindings={{ value: instrument.chorus }}
      />

      {/* ── Lower: Volume ───────────────────────────────────────────── */}
      <LabeledKnob
        {...KNOB_PROPS}
        x={810}
        y={466}
        instrument={instrument}
        instrumentProp={instrument.volume}
        textLabel={knobLabel('VOLUME')}
      />

      {/* ── MIDI Keyboard ───────────────────────────────────────────── */}
      <geMidiKeyboard
        x={40}
        y={483}
        width={745}
        height={90}
        lowKey={48}
        highKey={101}
        keys={{
          whiteHeight: 70,
          blackHeight: 38,
          spacing: 2,
          whiteColor: 'DDDDDD',
          whiteHoverColor: 'EEEEEE',
          whitePressedColor: '5177E0',
          whiteOutlineColor: 'AAAAAA',
          blackColor: '222222',
          blackHoverColor: '444444',
          blackPressedColor: '5177E0',
        }}
      />
    </>
  );
}
