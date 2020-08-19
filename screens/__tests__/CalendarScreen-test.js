import * as React from "react";
import renderer from "react-test-renderer";

import CalendarScreen from "../CalendarScreen";
import { JsxEmit } from "typescript";

describe("CalendarScreenTest", () => {
  test("renders correctly", () => {
    const tree = renderer.create(<CalendarScreen />).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
