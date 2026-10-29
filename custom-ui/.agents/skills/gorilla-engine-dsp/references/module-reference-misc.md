# Gorilla Editor — Module Reference: Miscellaneous Modules

Covers: Alternate Mapping, Voice Group, Wavetable, MIDI File, and Data File.

## Contents
1. [Alternate Mapping](#Alternate-Mapping)
2. [Voice Group](#Voice-Group)
3. [Wavetable](#Wavetable)
4. [MIDI File](#MIDI-File)
5. [Data File](#Data-File)

---

## Alternate Mapping
Collection of Zones that can be played by any Group, as an alternative to the Group's own Zones.
| Parameter | Description |
| --------- | ----------- |
| Name | Name to display for this Mapping. |
| Active | When switched off, this mapping's samples will be purged (not preloaded in memory) unless they are used in other Groups or Mappings. |
| Zones | [Zone](#Zone) |

## Voice Group
Polyphony management settings. The available voices in a Voice Group are shared between all Groups assigned to that Voice Group. There is always at least one Voice Group called Instrument Voices which sets the overall maximum polyphony of the instrument. If a Group is not assigned to a Voice Group its polyphony is still managed by the Instrument Voices settings.
| Parameter | Description |
| --------- | ----------- |
| Max Voices | Maximum number of voices for all Groups assigned to this voice Group. |
| Per-Key Voices | Maximum number of voices on the same note (leave set to '-' if not needed). |
| Voices | Displays the current number of voices played in this Voice Group. |
| Voice Stealing | Priority mode for stealing voices when Max Voices is exceeded. |
| Prefer Released | Prefer to steal voices that were already released. |
| Exclusive Group | When a voice is triggered, all voices in other Groups with the same Exclusive Group setting in their voice Group will be cut off. |
| Fade Time | Fade-out length for voices that get stolen. |

## Wavetable
Set of waveforms that can be played by the Wavetable oscillator. The size and number of waveforms in the wavetable can be varied, and they be overwritten by dropping a WAV file. When using the 'windowed' option the spectrum is measured at equally spaced points along the WAV file, otherwise the WAV file is assumed to contain a series of single cycle waveforms to import. The import uses the current size and number of waveforms - it can help to try adjusting these to get the best import, or adjusting the wavetable size (number of harmonics) after import.
| Parameter | Description |
| --------- | ----------- |
| Name | Name to display for this module. |
| Waves | Waveform/spectrum editor. |

## MIDI File
MIDI sequence, created by dragging a .mid file into the instrument. Can be accessed by the instrument script.
| Parameter | Description |
| --------- | ----------- |
| Name | Name to display for this module. |
| File Path | Displayed the location of the MIDI file on your computer |
| Reload | Re-loads the MIDI file into the module (for example, if the file has been edited) |
| Tracks | Displays the number of tracks in the sequence. |

## Data File
Array of data, created by dragging a .csv or .nka file into the instrument. Can be accessed by the instrument script. The file should only contain integer values separated by commas and line breaks.
| Parameter | Description |
| --------- | ----------- |
| Name | Name to display for this module. |
| Save Changes | Determines if and how modified data is saved. OFF means data is not saved. SESSION means modified data is saved with the session. PATCH means modified data is saved with the patch. |
| Range | Sets the available range for step values. Options include +/- 128 steps, +/- 20,000 steps, or +/- 1,000,000 steps. |
| Steps | Sets the maximum number of steps in the data file. |
| Data | Data is visually displayed and can be edited by click-dragging. |
| Step Value | The currently selected step (highlighted) with precision by click-dragging its numerical value or by double-clicking the value and entering it directly. |
