private void tbInput_TextChanged(object sender, TextChangedEventArgs e)
{
	string[] input = tbInput.Text.Split('\n', '\r', StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries);
	lbTimestamps.Items.Clear();
	string[] lastLine = null;
	foreach(string line in input)
	{
		string[] lineSplit = line.Split(' ', 2);
		if (TimeSpan.TryParse(line.Split()[0], out TimeSpan timespan) && lineSplit.Length == 2) {
			if (lastLine != null) {
				int itemIndex = lbTimestamps.Items.Add(timespan - TimeSpan.Parse(lastLine[0]) + " " + lastLine[1]);
				lbTimestamps.SelectedItems.Add(lbTimestamps.Items[itemIndex]);
			}
			lastLine = lineSplit;
		}
	}

	if (lastLine != null) {
		int itemIndex = lbTimestamps.Items.Add("XX:XX:XX " + lastLine[1]);
		lbTimestamps.SelectedItems.Add(lbTimestamps.Items[itemIndex]);
	}
}

    private void lbTimestamps_SelectionChanged(object sender, SelectionChangedEventArgs e)
{
	tbOutput.Clear();
	List < string > output = new List < string > ();
	TimeSpan totalTimespan = new TimeSpan();
	foreach(string item in (sender as ListBox).Items)
	{
		if ((sender as ListBox).SelectedItems.Contains(item)) {
			output.Add(totalTimespan.ToString(@"hh\:mm\:ss") + " " + item.Split(" ", 2)[1]);
			if (TimeSpan.TryParse(item.Split()[0], out TimeSpan timespan)) {
				totalTimespan += timespan;
			}
		}
	}
	tbOutput.Text = String.Join('\n', output);
}