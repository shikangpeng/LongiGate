## Python snippets that you can use to auto extract the prolific ID and their time of completion
## These will help create the timestamp file necessary for time auto-detection

for file in file_paths:
    file_path = os.path.join(data_path, file)
    df = pd.read_csv(file_path, usecols=['prolific_id', 'timestamp_ses1', 'timestamp_ses2', 'image', 'phase'])
    
    subject_id = df['prolific_id'][0]
    subject_file_prefix = f'sub-{subject_id}'

    # Skip if already processed
    if subject_file_prefix in existing_subjects:
        continue

    print(f'Processing subject ID (Prolific ID): {subject_id}')

    # Save session timestamps
    # Remove the problem of creating an extra line
    time_df = pd.DataFrame({'time_ses1': [df['timestamp_ses1'].iloc[-1].strip("[]")], 'time_ses2': [df['timestamp_ses2'].iloc[-1].strip("[]")]})
    csv_path = f'~/resources/subject_time/{subject_file_prefix}_time.csv'
    with open(csv_path, 'w', newline='') as f:
        time_df.to_csv(f, index=False, lineterminator='\n')
    with open(csv_path, 'r', newline='') as f:
        content = f.read().rstrip('\n')
    with open(csv_path, 'w', newline='') as f:
        f.write(content)
