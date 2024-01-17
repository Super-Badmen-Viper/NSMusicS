import sys
import numpy as np
import csv
import librosa

def extract_max(pitches, magnitudes, shape):
    new_pitches = []
    new_magnitudes = []
    for i in range(0, shape[1]):
        new_pitches.append(np.max(pitches[:, i]))
        new_magnitudes.append(np.max(magnitudes[:, i]))
    return new_pitches, new_magnitudes
def smooth(x, window_len=11, window='hanning'):
    if window_len < 3:
        return x
    if window not in ['flat', 'hanning', 'hamming', 'bartlett', 'blackman']:
        raise ValueError("Window is one of 'flat', 'hanning', 'hamming', 'bartlett', 'blackman'")
    s = np.r_[2 * x[0] - x[window_len-1::-1], x, 2 * x[-1] - x[-1:-window_len:-1]]
    if window == 'flat':  # moving average
        w = np.ones(window_len, 'd')
    else:
        w = eval('numpy.' + window + '(window_len)')
    y = np.convolve(w / w.sum(), s, mode='same')
    return y[window_len:-window_len+1]
def set_variables(sample_f, duration, window_time, fmin, fmax, overlap):
    total_samples = sample_f * duration
    window_size = sample_f // 1000 * window_time  # Use integer division
    hop_length = total_samples // window_size
    needed_nb_windows = total_samples // (window_size - overlap)
    n_fft = int(needed_nb_windows * 2.0)
    return total_samples, window_size, needed_nb_windows, n_fft, hop_length

def analyse(y, sr, n_fft, hop_length, fmin, fmax, window_size, overlap, sample_f):
    spectrogram = np.abs(librosa.stft(y, n_fft=n_fft, hop_length=hop_length))

    # Apply filtering: Exclude values close to 0
    min_magnitude_threshold = 1e-5  # Adjust as needed
    spectrogram_filtered = np.where(spectrogram >= min_magnitude_threshold, spectrogram, 0)

    # Convert amplitude to dB
    spectrogram_dB = librosa.amplitude_to_db(spectrogram_filtered)

    # Calculate the time duration of each window
    window_duration = window_size / sample_f * (1.0 - overlap / 100.0)

    # Initialize variables to store time and duration information
    time_duration_info = []

    # Get the number of frames and time points
    nb_frames, nb_time_points = spectrogram_dB.shape

    # Add initial silent part to match audio duration
    initial_silent_duration = librosa.frames_to_time(nb_frames, sr=sr, hop_length=hop_length)
    for i in range(nb_time_points):
        playback_time = librosa.frames_to_time(i, sr=sr, hop_length=hop_length)
        if playback_time < initial_silent_duration:
            time_duration_info.append((playback_time, 0, 0, 0, 0))  # Placeholder for initial silent part
        else:
            break

    # Iterate through each time point and record magnitude and duration
    for i in range(nb_time_points):
        pitch = np.max(spectrogram_dB[:, i])
        start_time = i * window_duration
        end_time = start_time + window_duration
        playback_time = librosa.frames_to_time(i, sr=sr, hop_length=hop_length)
        duration = end_time - start_time
        time_duration_info.append((playback_time, np.max(spectrogram_dB[:, i]), start_time, duration, end_time))

    # Return the time and duration information
    return time_duration_info
def main():
    # Set all wanted variables

    # We want a sample frequency of 16 000
    sample_f = 16000
    # The duration of the voice sample
    duration = 10
    # We want a windowsize of 30 ms
    window_time = 60
    fmin = 80
    fmax = 250
    # We want an overlap of 10 ms
    overlap = 20
    total_samples, window_size, needed_nb_windows, n_fft, hop_length = set_variables(
        sample_f, duration, window_time, fmin, fmax, overlap)

    # y = audio time series
    # sr = sampling rate of y
    y, sr = librosa.load('Vocals.wav', sr=sample_f)

    pitch_duration_info = analyse(y, sr, n_fft, hop_length, fmin, fmax, window_size, overlap, sample_f)

    # Write pitch and duration information to CSV file
    csv_file_path = 'pitch_duration_info.csv'
    with open(csv_file_path, 'w', newline='', encoding='utf-8') as csvfile:
        csv_writer = csv.writer(csvfile)
        csv_writer.writerow(['Playback Time', 'Pitch', 'Start Time','Duration', 'End Time'])  # Updated column names
        csv_writer.writerows(pitch_duration_info)

    # Add this function call in your main() function after pitch extraction
    # plot_spectrogram(y, sr, n_fft, hop_length)

if __name__ == "__main__":
    main()
    sys.exit()
    #plt.close('all')
